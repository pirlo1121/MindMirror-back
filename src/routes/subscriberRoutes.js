const express = require('express');
const { register, unsubscribe, pause, activate, remove, getAllSubscribers } = require('../controllers/subscriberController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validateSubscriber, handleValidationErrors } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.post('/', validateSubscriber, handleValidationErrors, register);
router.get('/unsubscribe', unsubscribe);

router.use(protect, authorize('admin'));

router.get('/', getAllSubscribers);
router.patch('/:id/pause', pause);
router.patch('/:id/activate', activate);
router.delete('/:id', remove);

module.exports = router;
