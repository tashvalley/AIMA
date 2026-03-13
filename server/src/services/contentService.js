const path = require('path');
const { PrismaClient } = require('@prisma/client');
const googleAi = require('./googleAiService');
const fileService = require('./fileService');

const prisma = new PrismaClient();
const UPLOADS_DIR = path.resolve(__dirname, '..', '..', 'uploads');

const POST_SYSTEM_PROMPT =
  'You are a professional content creator. Generate engaging, well-structured content based on the user prompt. Include a compelling headline and body text suitable for a blog post or social media. Format with markdown.';

const VIDEO_SYSTEM_PROMPT =
  'You are a professional social media content creator. Based on the user prompt, generate a short, engaging caption or description that would accompany a video on social media (Instagram, TikTok, YouTube Shorts). Include relevant hashtags. Keep it concise — 2-3 sentences max plus hashtags.';

exports.generatePost = async (userId, prompt, aspectRatio = '16:9') => {
  const content = await prisma.content.create({
    data: { type: 'POST', status: 'GENERATING', prompt, aspectRatio, userId },
  });

  try {
    // Generate text and image in parallel
    const [generatedText, imageData] = await Promise.all([
      googleAi.generateText(prompt, POST_SYSTEM_PROMPT),
      googleAi.generateImage(prompt, aspectRatio),
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
    // Clean up — don't keep failed records
    await prisma.content.delete({ where: { id: content.id } }).catch(() => {});
    throw err;
  }
};

exports.generateVideo = async (userId, prompt, withAudio = true, aspectRatio = '16:9') => {
  const content = await prisma.content.create({
    data: { type: 'VIDEO', status: 'GENERATING', prompt, aspectRatio, userId },
  });

  try {
    // Step 1: Generate script text
    const generatedText = await googleAi.generateText(prompt, VIDEO_SYSTEM_PROMPT);

    await prisma.content.update({
      where: { id: content.id },
      data: { generatedText },
    });

    // Step 2: Generate video and save directly via SDK
    const filename = `${content.id}.mp4`;
    const downloadPath = path.join(UPLOADS_DIR, filename);
    await googleAi.generateVideo(prompt, downloadPath, withAudio, aspectRatio);
    const mediaUrl = `/uploads/${filename}`;

    return await prisma.content.update({
      where: { id: content.id },
      data: {
        status: 'COMPLETED',
        mediaUrl,
        mediaType: 'video/mp4',
      },
    });
  } catch (err) {
    // Clean up — don't keep failed records
    await prisma.content.delete({ where: { id: content.id } }).catch(() => {});
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
