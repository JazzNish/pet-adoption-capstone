import express from 'express';
import { createPet, getRehomerPets, getAllPets, getPetById, getAllPetsAdmin, deletePetAdmin } from '../controllers/petController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

/* CREATE PET (REHOMER ONLY - Keep this protected!) */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("rehomer"),
  createPet
);

/* 🌍 PUBLIC ROUTES (Anyone can view these!) */
router.get("/", getAllPets);

// 👇 THE FIX: Removed the security guards so the Public Profile can fetch the data!
router.get("/my-pets/:ownerId", getRehomerPets); 

router.get("/:id", getPetById);

/* ADMIN ROUTES */
router.get('/admin/all', getAllPetsAdmin);
router.delete('/admin/:id', deletePetAdmin);

export default router;