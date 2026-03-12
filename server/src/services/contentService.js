const { PrismaClient } = require('@prisma/client');
const googleAi = require('./googleAiService');
const fileService = require('./fileService');

const prisma = new PrismaClient();

const POST_SYSTEM_PROMPT =
  'You are a professional content creator. Generate engaging, well-structured content based on the user prompt. Include a compelling headline and body text suitable for a blog post or social media. Format with markdown.';

const VIDEO_SYSTEM_PROMPT =
  'You are a professional video script writer. Generate a short, compelling script for a 5-second video based on the user prompt. Keep it concise and visual. Return only the script text.';

exports.generatePost = async (userId, prompt) => {
  const content = await prisma.content.create({
    data: { type: 'POST', status: 'GENERATING', prompt, userId },
  });

  try {
    // Generate text and image in parallel
    const [generatedText, imageData] = await Promise.all([
      googleAi.generateText(prompt, POST_SYSTEM_PROMPT),
      googleAi.generateImage(prompt),
    ]);

    // Save image to disk
    const ext = imageData.mimeType === 'image/jpeg' ? 'jpg' : 'png';
    const mediaUrl = fileService.saveBase64(imageData.base64, `${content.id}.${ext}`);

    return await prisma.content.update({
      where: { id: content.id },
      data: {
        status: 'COMPLETED',
        generatedText,
        mediaUrl,
        mediaType: imageData.mimeType,
      },
    });
  } catch (err) {
    await prisma.content.update({
      where: { id: content.id },
      data: { status: 'FAILED', errorMessage: err.message },
    });
    throw err;
  }
};

exports.generateVideo = async (userId, prompt) => {
  const content = await prisma.content.create({
    data: { type: 'VIDEO', status: 'GENERATING', prompt, userId },
  });

  try {
    // Step 1: Generate script text
    const generatedText = await googleAi.generateText(prompt, VIDEO_SYSTEM_PROMPT);

    await prisma.content.update({
      where: { id: content.id },
      data: { generatedText },
    });

    // Step 2: Generate a source image from the prompt
    const imageData = await googleAi.generateImage(prompt);

    // Step 3: Generate video from image + prompt
    const videoResult = await googleAi.generateVideo(
      prompt,
      imageData.base64,
      imageData.mimeType
    );

    // Save video to disk
    const video = videoResult.generatedVideos[0];
    const mediaUrl = fileService.saveBase64(video.video.videoBytes, `${content.id}.mp4`);

    return await prisma.content.update({
      where: { id: content.id },
      data: {
        status: 'COMPLETED',
        mediaUrl,
        mediaType: 'video/mp4',
      },
    });
  } catch (err) {
    await prisma.content.update({
      where: { id: content.id },
      data: { status: 'FAILED', errorMessage: err.message },
    });
    throw err;
  }
};

exports.getContentById = async (id, userId) => {
  return prisma.content.findFirst({
    where: { id, userId },
  });
};

exports.getContentHistory = async (userId, { type, page = 1, limit = 20 }) => {
  const where = { userId };
  if (type) where.type = type;

  const [contents, total] = await Promise.all([
    prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.content.count({ where }),
  ]);

  return { contents, total, page, totalPages: Math.ceil(total / limit) };
};

exports.deleteContent = async (id, userId) => {
  const content = await prisma.content.findFirst({ where: { id, userId } });
  if (!content) {
    const err = new Error('Content not found');
    err.status = 404;
    throw err;
  }

  // Delete associated file
  if (content.mediaUrl) {
    fileService.deleteFile(content.mediaUrl);
  }

  return prisma.content.delete({ where: { id } });
};
