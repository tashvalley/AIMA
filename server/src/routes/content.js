const router = require('express').Router();
const contentController = require('../controllers/contentController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/generate-post', contentController.generatePost);
router.post('/generate-video', contentController.generateVideo);
router.get('/history', contentController.getHistory);
router.get('/:id', contentController.getById);
router.delete('/:id', contentController.delete);

module.exports = router;
