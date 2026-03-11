import express from 'express';
import { 
    submitApplication, 
    getMyApplications, 
    getRehomerApplications, 
    updateApplicationStatus 
} from '../controllers/applicationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Adopter Routes
router.post('/submit', authMiddleware, submitApplication);
router.get('/my-applications', authMiddleware, getMyApplications);

// 🚨 NEW: Rehomer Routes
router.get('/received', authMiddleware, getRehomerApplications);
router.put('/:id/status', authMiddleware, updateApplicationStatus);

export default router;