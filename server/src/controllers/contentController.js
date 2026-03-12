const contentService = require('../services/contentService');

exports.generatePost = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }
    const content = await contentService.generatePost(req.userId, prompt);
    res.status(201).json({ success: true, data: content });
  } catch (err) {
    next(err);
  }
};

exports.generateVideo = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }
    const content = await contentService.generateVideo(req.userId, prompt);
    res.status(201).json({ success: true, data: content });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const data = await contentService.getContentHistory(req.userId, {
      type,
      page: +page,
      limit: +limit,
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
