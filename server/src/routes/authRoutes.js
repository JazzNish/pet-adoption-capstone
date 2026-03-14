import express from 'express';
import { googleAuth, firebaseEmailLogin, adminLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/admin-login', adminLogin);
router.post('/google', googleAuth);
router.post('/firebase-login', firebaseEmailLogin);

export default router;