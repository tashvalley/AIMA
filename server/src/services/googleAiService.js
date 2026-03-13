const { GoogleGenAI } = require('@google/genai');
const config = require('../config');

const ai = new GoogleGenAI({ apiKey: config.googleAi.apiKey });

// --- Retry helper with exponential backoff ---
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

function isRetryable(err) {
  const msg = (err.message || '').toLowerCase();
  // Retry on rate limits, server errors, timeouts, network issues
  if (msg.includes('429') || msg.includes('resource_exhausted') || msg.includes('quota')) return true;
  if (msg.includes('503') || msg.includes('unavailable') || msg.includes('high demand')) return true;
  if (msg.includes('500') || msg.includes('internal')) return true;
  if (msg.includes('timed out') || msg.includes('timeout') || msg.includes('econnreset')) return true;
  if (msg.includes('enotfound') || msg.includes('econnrefused') || msg.includes('socket')) return true;
  // Don't retry permanent errors (400, 403, 404, invalid argument, etc.)
  return false;
}

async function withRetry(fn, label) {
  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES && isRetryable(err)) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt); // 2s, 4s, 8s
        console.warn(`[${label}] Attempt ${attempt + 1} failed: ${err.message}. Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        break;
      }
    }
  }
  throw lastError;
}

// --- AI generation functions ---

exports.generateText = async (prompt, systemPrompt) => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });
    return response.text;
  }, 'generateText');
};

exports.generateImage = async (prompt) => {
  return withRetry(async () => {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
      },
    });
    const image = response.generatedImages[0];
    return {
      base64: image.image.imageBytes,
      mimeType: 'image/png',
    };
  }, 'generateImage');
};

exports.generateVideo = async (prompt, downloadPath, withAudio = true) => {
  const videoModel = withAudio ? 'veo-3.0-generate-001' : 'veo-2.0-generate-001';

  // Retry the initial video generation kick-off
  let operation = await withRetry(async () => {
    return ai.models.generateVideos({
      model: videoModel,
      prompt,
      config: {
        aspectRatio: '16:9',
        durationSeconds: 8,
      },
    });
  }, 'generateVideo');

  // Poll until generation completes (max ~5 min)
  const maxAttempts = 30;
  let attempts = 0;
  while (!operation.done && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await withRetry(async () => {
      return ai.operations.getVideosOperation({ operation });
    }, 'pollVideo');
    attempts++;
  }

  if (!operation.done) {
    throw new Error('Video generation timed out');
  }

  // Download using SDK (handles auth automatically) — also retryable
  const video = operation.response.generatedVideos[0];
  await withRetry(async () => {
    return ai.files.download({
      file: video.video,
      downloadPath,
    });
  }, 'downloadVideo');
};
