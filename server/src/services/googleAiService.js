const { GoogleGenAI } = require('@google/genai');
const config = require('../config');

const ai = new GoogleGenAI({ apiKey: config.googleAi.apiKey });

exports.generateText = async (prompt, systemPrompt) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text;
};

exports.generateImage = async (prompt) => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt,
    config: {
      numberOfImages: 1,
    },
  });

  const image = response.generatedImages[0];
  return {
    base64: image.image.imageBytes,
    mimeType: 'image/png',
  };
};

exports.generateVideo = async (prompt) => {
  let operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt,
    config: {
      aspectRatio: '16:9',
    },
  });

  // Poll until generation completes (max ~5 min)
  const maxAttempts = 30;
  let attempts = 0;
  while (!operation.done && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
      operation,
    });
    attempts++;
  }

  if (!operation.done) {
    throw new Error('Video generation timed out');
  }

  return operation.response;
};
