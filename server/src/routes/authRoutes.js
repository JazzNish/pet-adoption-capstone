import express from 'express';
import { sendOtpCode, googleAuth, verifyEmail, firebaseEmailLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtpCode);
router.post('/verify', verifyEmail)
router.post('/google', googleAuth);
router.post('/firebase-login', firebaseEmailLogin);

export default router;