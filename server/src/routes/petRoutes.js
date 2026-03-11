import express from 'express';
import { createPet, getRehomerPets, getAllPets, getPetById } from '../controllers/petController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

/* CREATE PET (REHOMER ONLY) */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("rehomer"),
  createPet
);

router.get("/", getAllPets);

/* GET REHOMER DASHBOARD PETS */
router.get(
  "/my-pets/:ownerId",
  authMiddleware,
  roleMiddleware("rehomer"),
  getRehomerPets
);

router.get("/:id", getPetById);

export default router;
