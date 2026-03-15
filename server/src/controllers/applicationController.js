import Application from '../models/Application.js';

// 1. Submit a new application
export const submitApplication = async (req, res) => {
    try {
        const adopterId = req.user.id; // From authMiddleware
        const applicationData = { ...req.body, adopterId };

        // Prevent duplicate applications for the same pet
        const existingApp = await Application.findOne({ petId: req.body.petId, adopterId });
        if (existingApp) {
            return res.status(400).json({ message: "You have already applied for this pet." });
        }

        const newApplication = await Application.create(applicationData);
        res.status(201).json({ message: "Application submitted successfully", application: newApplication });
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Server error while submitting application." });
    }
};

// 2. Get applications for an Adopter (My Applications)
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ adopterId: req.user.id })
            .populate('petId', 'name imageUrls breed location')
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch your applications." });
    }
}; 

// 3. Get applications for a Rehomer (People applying for my pets)
export const getRehomerApplications = async (req, res) => {
    try {
        const applications = await Application.find({ rehomerId: req.user.id })
            .populate('petId', 'name imageUrls breed')
            .populate('adopterId', 'name email profilePicture')
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch applications for your pets." });
    }
};

// 4. Update Application Status (Approve/Reject)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.status(200).json({ message: `Application ${status}`, application });
    } catch (error) {
        res.status(500).json({ message: "Failed to update application status." });
    }
};

// --- DELETE AN APPLICATION ---
export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the application by its ID and delete it from MongoDB
        const deletedApp = await Application.findByIdAndDelete(id);

        if (!deletedApp) {
            return res.status(404).json({ message: "Application not found." });
        }

        res.status(200).json({ message: "Application successfully deleted." });
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({ message: "Server error while deleting application." });
    }
};