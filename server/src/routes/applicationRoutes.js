import express from 'express';
import { submitApplication, getMyApplications, getRehomerApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require the user to be logged in
router.use(authMiddleware);

router.post('/', submitApplication);
router.get('/adopter', getMyApplications);
router.get('/rehomer', getRehomerApplications);
router.put('/:id/status', updateApplicationStatus);

export default router;