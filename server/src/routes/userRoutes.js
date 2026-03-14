import express from 'express';
import { updateProfile, submitId, getPublicProfile, getPendingUsers, approveUser, rejectUser, toggleSavePet, getMySavedPets, getAllUsers, toggleBanUser, deleteUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// PUT request to update name/photo
router.put('/profile', authMiddleware, updateProfile);

// POST request to submit the ID document
router.post('/submit-id', authMiddleware, submitId);

router.get('/:id/public', getPublicProfile);
router.get('/', getAllUsers);

router.get('/admin/pending', authMiddleware, roleMiddleware('admin'), getPendingUsers);
router.put('/admin/approve/:id', authMiddleware, roleMiddleware('admin'), approveUser);
router.put('/admin/reject/:id', authMiddleware, roleMiddleware('admin'), rejectUser);
router.put('/:id/ban', toggleBanUser);
router.delete('/:id', deleteUser);

router.put('/save-pet/:petId', authMiddleware, toggleSavePet);
router.get('/saved-pets', authMiddleware, getMySavedPets);


export default router;