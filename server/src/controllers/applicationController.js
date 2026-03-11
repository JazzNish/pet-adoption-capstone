import Application from '../models/Application.js';
import Pet from '../models/Pet.js';

// --- 1. SUBMIT A NEW APPLICATION ---
export const submitApplication = async (req, res) => {
    try {
        const { petId, rehomerId, salary, livingSituation, experience, reason, otherPets, contactNumber } = req.body;
        
        const adopterId = req.user.id;

        // Check if they already applied
        const existingApp = await Application.findOne({ adopter: adopterId, pet: petId });
        if (existingApp) {
            return res.status(400).json({ message: "You have already applied for this pet!" });
        }

        const newApplication = await Application.create({
            adopter: adopterId,
            pet: petId,
            rehomer: rehomerId,
            salary,
            livingSituation,
            experience,
            reason,         
            otherPets,      
            contactNumber   
        });

        res.status(201).json(newApplication);
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Failed to submit application" });
    }
};

// --- 2. GET ADOPTER'S APPLICATIONS (For "My Applications" page) ---
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ adopter: req.user.id })
            .populate('pet')
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching my applications:", error);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
};

// --- 3. GET REHOMER'S ADOPTION REQUESTS (For "Adoption Requests" page) ---
export const getRehomerApplications = async (req, res) => {
    try {
        const applications = await Application.find({ rehomer: req.user.id })
            .populate('pet')
            .populate('adopter', 'firstName lastName email') // Pulls the adopter's basic info
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching rehomer requests:", error);
        res.status(500).json({ message: "Failed to fetch adoption requests" });
    }
};

// --- 4. UPDATE APPLICATION STATUS (The Smart Waitlist Version!) ---
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        
        const application = await Application.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true } 
        ).populate('pet'); 

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // If approved, update the Pet to 'Pending' to hide it from Browse Pets
        if (status === 'Approved') {
            await Pet.findByIdAndUpdate(application.pet._id, { status: 'Pending' });
        }

        // If they change their mind and Reject an already approved app, make the pet Available again
        if (status === 'Rejected') {
            const otherApproved = await Application.findOne({ pet: application.pet._id, status: 'Approved' });
            if (!otherApproved) {
                await Pet.findByIdAndUpdate(application.pet._id, { status: 'Available' });
            }
        }

        res.status(200).json(application);
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Failed to update status" });
    }
};