const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

const genAI = new GoogleGenerativeAI(config.googleAi.apiKey);

exports.generateText = async (prompt, systemPrompt) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
};

exports.generateImage = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-002' });

  const result = await model.generateImages({
    prompt,
    config: { numberOfImages: 1 },
  });

  // Returns base64 image data
  const image = result.generatedImages[0];
  return {
    base64: image.image.imageBytes,
    mimeType: image.image.mimeType || 'image/png',
  };
};

exports.generateVideo = async (prompt, imageBase64, imageMimeType) => {
  const model = genAI.getGenerativeModel({ model: 'veo-2.0-generate-001' });

  const generateConfig = {
    prompt,
    config: {
      numberOfVideos: 1,
      durationSeconds: 5,
      aspectRatio: '16:9',
    },
  };

  // If a source image is provided, use image-to-video
  if (imageBase64) {
    generateConfig.image = {
      imageBytes: imageBase64,
      mimeType: imageMimeType || 'image/png',
    };
  }

  const result = await model.generateVideos(generateConfig);
  return result;
};
