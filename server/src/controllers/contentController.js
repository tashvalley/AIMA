const contentService = require('../services/contentService');

const MAX_PROMPT_LENGTH = 10000;
const VALID_CONTENT_TYPES = ['POST', 'VIDEO'];
const MAX_PAGE_LIMIT = 100;

exports.generatePost = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({ success: false, message: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer` });
    }
    const content = await contentService.generatePost(req.userId, prompt.trim());
    res.status(201).json({ success: true, data: content });
  } catch (err) {
    next(err);
  }
};

exports.generateVideo = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({ success: false, message: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer` });
    }
    const content = await contentService.generateVideo(req.userId, prompt.trim());
    res.status(201).json({ success: true, data: content });
  } catch (err) {
    next(err);
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

exports.delete = async (req, res, next) => {
  try {
    await contentService.deleteContent(req.params.id, req.userId);
    res.json({ success: true, message: 'Content deleted' });
  } catch (err) {
    next(err);
  }
};
