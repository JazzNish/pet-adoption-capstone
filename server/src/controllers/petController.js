import Pet from '../models/Pet.js';
import Application from '../models/Application.js';
import Message from '../models/Message.js';

/* CREATE PET (REHOMER ONLY) */
// --- ADD A NEW PET ---
// --- ADD A NEW PET ---
export const createPet = async (req, res) => {
    try {
        // 1. Grab EVERY single field from the frontend
        const { 
            name, species, breed, age, ageUnit, gender, 
            weight, weightUnit, location, healthInfo, 
            description, imageUrls
        } = req.body;
        
        const ownerId = req.user.id; 

        // 2. Pass them all to MongoDB
        const newPet = await Pet.create({
            name,
            species,
            breed,
            age,
            ageUnit,       // 👈 Passed!
            gender,       
            weight,        // 👈 Passed!
            weightUnit,    // 👈 Passed!
            location,     
            healthInfo,   
            description,
            imageUrls,
            owner: ownerId
        });

        res.status(201).json(newPet);
    } catch (error) {
        // Pro-Tip: If it crashes again, look at your backend terminal! 
        // This console.log will tell you exactly which field MongoDB is angry about.
        console.error("Error creating pet:", error); 
        res.status(500).json({ message: "Failed to add pet" });
    }
};

/* GET PETS FOR THE DASHBOARD */
export const getRehomerPets = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const pets = await Pet.find({ owner: ownerId }).sort({ createdAt: -1 }); // Newest first
        res.status(200).json(pets);
    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).json({ message: "Failed to fetch pets" });
    }
};

export const getAllPets = async (req, res) => {
    try {
        // 👇 Add { status: 'Available' } inside the find block!
        const pets = await Pet.find({ status: 'Available' }).sort({ createdAt: -1 });
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch pets" });
    }
};

/* GET SINGLE PET BY ID */
export const getPetById = async (req, res) => {
    try {
        console.log("Looking for pet with ID:", req.params.id); // Add this tracker!
        const pet = await Pet.findById(req.params.id).populate('owner', 'name profilePicture');
        
        if (!pet) {
            return res.status(404).json({ message: "Pet not found in database" });
        }
        
        res.status(200).json(pet);
    } catch (error) {
        console.error("Error fetching pet:", error);
        res.status(500).json({ message: "Failed to fetch pet details" });
    }
};

// --- DELETE PET AND ALL RELATED DATA ---
export const deletePet = async (req, res) => {
    try {
        const petId = req.params.id;

        // 1. Find the pet and verify it exists (and maybe check if the user actually owns it)
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // 2. Delete the actual pet
        await Pet.findByIdAndDelete(petId);

        // 3. 🚨 CASCADE DELETE: Destroy all related applications!
        await Application.deleteMany({ pet: petId });

        // 4. 🚨 CASCADE DELETE: Destroy all chat history for this pet!
        await Message.deleteMany({ pet: petId });

        res.status(200).json({ message: "Pet, applications, and messages successfully deleted!" });
    } catch (error) {
        console.error("Error deleting pet:", error);
        res.status(500).json({ message: "Failed to delete pet" });
    }
};

export const getAllPetsAdmin = async (req, res) => {
    try {
        // .populate() is magic! It goes to the User database and grabs the Rehomer's name 
        // so we don't just see a random ID string in the admin table.
        const pets = await Pet.find({})
            .populate('rehomerId', 'name email') 
            .sort({ createdAt: -1 });
            
        res.status(200).json(pets);
    } catch (error) {
        console.error("Fetch Pets Error:", error);
        res.status(500).json({ message: "Server error while fetching pets." });
    }
};

export const deletePetAdmin = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found." });
        }

        await Pet.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Pet listing removed successfully." });
    } catch (error) {
        console.error("Delete Pet Error:", error);
        res.status(500).json({ message: "Server error while deleting pet." });
    }
};