const path = require('path');
const contentService = require('../services/contentService');

const MAX_PROMPT_LENGTH = 10000;
const VALID_CONTENT_TYPES = ['POST', 'VIDEO'];
const MAX_PAGE_LIMIT = 100;
const VALID_IMAGE_RATIOS = ['1:1', '3:4', '4:3', '9:16', '16:9'];
const VALID_VIDEO_RATIOS = ['16:9', '9:16'];

function friendlyAiError(err) {
  const msg = err.message || '';
  if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.includes('quota')) {
    return 'AI rate limit reached. Please wait a minute and try again.';
  }
  if (msg.includes('PERMISSION_DENIED') || msg.includes('403')) {
    return 'API key does not have permission for this model. Check your Google AI API key.';
  }
  if (msg.includes('NOT_FOUND') || msg.includes('404') || msg.includes('no longer available')) {
    return 'AI model is currently unavailable. Please try again later.';
  }
  if (msg.includes('INVALID_ARGUMENT') || msg.includes('400')) {
    return 'The prompt was rejected by the AI. Try rephrasing your request.';
  }
  if (msg.includes('UNAVAILABLE') || msg.includes('503') || msg.includes('high demand')) {
    return 'AI model is experiencing high demand. Please try again in a few minutes.';
  }
  if (msg.includes('timed out')) {
    return 'Generation timed out. Please try again.';
  }
  return 'Content generation failed. Please try again.';
}

exports.generatePost = async (req, res, next) => {
  try {
    const { prompt, aspectRatio } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({ success: false, message: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer` });
    }
    const safeRatio = VALID_IMAGE_RATIOS.includes(aspectRatio) ? aspectRatio : '16:9';
    const content = await contentService.generatePost(req.userId, prompt.trim(), safeRatio);
    res.status(201).json({ success: true, data: content });
  } catch (err) {
    console.error('Post generation error:', err.message);
    res.status(502).json({ success: false, message: friendlyAiError(err) });
  }
};

exports.generateVideo = async (req, res, next) => {
  try {
    const { prompt, withAudio, aspectRatio } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({ success: false, message: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer` });
    }
    const safeRatio = VALID_VIDEO_RATIOS.includes(aspectRatio) ? aspectRatio : '16:9';
    const content = await contentService.generateVideo(req.userId, prompt.trim(), withAudio !== false, safeRatio);
    res.status(201).json({ success: true, data: content });
  } catch (err) {
    console.error('Video generation error:', err.message);
    res.status(502).json({ success: false, message: friendlyAiError(err) });
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    if (type && !VALID_CONTENT_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid content type. Must be POST or VIDEO' });
    }

    const safePage = Math.max(1, Math.floor(+page) || 1);
    const safeLimit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Math.floor(+limit) || 20));

    const data = await contentService.getContentHistory(req.userId, {
      type,
      page: safePage,
      limit: safeLimit,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const content = await contentService.getContentById(req.params.id, req.userId);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, data: content });
  } catch (err) {
    next(err);
  }
};

exports.download = async (req, res, next) => {
  try {
    const content = await contentService.getContentById(req.params.id, req.userId);
    if (!content || !content.mediaUrl) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const filename = path.basename(content.mediaUrl);
    const filePath = path.resolve(__dirname, '..', '..', 'uploads', filename);

    // Prevent path traversal
    const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(400).json({ success: false, message: 'Invalid file' });
    }

    const ext = path.extname(filename).toLowerCase();
    const downloadName = content.type === 'VIDEO' ? `aima-video${ext}` : `aima-image${ext}`;

    res.download(filePath, downloadName);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await contentService.deleteContent(req.params.id, req.userId);
    res.json({ success: true, message: 'Content deleted' });
  } catch (err) {
    next(err);
  }
};
