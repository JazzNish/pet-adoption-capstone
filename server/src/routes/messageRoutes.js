import express from 'express';
import { sendMessage, getConversation, getInbox} from '../controllers/messageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/inbox', authMiddleware, getInbox);
router.post('/send', authMiddleware, sendMessage);
router.get('/:petId/:otherUserId', authMiddleware, getConversation);

export default router;