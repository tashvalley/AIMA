const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const contentController = require('../controllers/contentController');
const auth = require('../middleware/auth');

const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many generation requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(auth);

router.post('/generate-post', generateLimiter, contentController.generatePost);
router.post('/generate-video', generateLimiter, contentController.generateVideo);
router.get('/history', contentController.getHistory);
router.get('/:id', contentController.getById);
router.get('/:id/download', contentController.download);
router.delete('/:id', contentController.delete);

module.exports = router;
