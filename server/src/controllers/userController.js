import User from '../models/User.js';

// --- UPDATE PROFILE (Name & Photo) ---
export const updateProfile = async (req, res) => {
    try {
        const { name, profilePicture, about } = req.body;
        
        // Find the user by the ID embedded in their secure JWT token
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the fields
        user.name = name || user.name;
        user.profilePicture = profilePicture || user.profilePicture;

        if (about !== undefined) user.about = about;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            role: updatedUser.role,
            idVerificationStatus: updatedUser.idVerificationStatus,
            about: updatedUser.about
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

// --- SUBMIT ID FOR VERIFICATION ---
export const submitId = async (req, res) => {
    try {
        const { idDocumentUrl } = req.body;

        if (!idDocumentUrl) {
            return res.status(400).json({ message: "ID Document URL is required" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Save the image URL and change their status to pending!
        user.idDocumentUrl = idDocumentUrl;
        user.idVerificationStatus = 'pending';

        await user.save();

        res.status(200).json({ message: "ID submitted successfully for review" });
    } catch (error) {
        console.error("ID Submission Error:", error);
        res.status(500).json({ message: "Failed to submit ID" });
    }
};

/* GET PUBLIC PROFILE INFO */
export const getPublicProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Find the user, but ONLY select the safe, public fields!
        const publicUser = await User.findById(userId).select('name profilePicture idVerificationStatus createdAt about role');

        if (!publicUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(publicUser);
    } catch (error) {
        console.error("Error fetching public profile:", error);
        res.status(500).json({ message: "Failed to fetch user profile" });
    }
};

// --- ADMIN: GET PENDING VERIFICATIONS ---
export const getPendingUsers = async (req, res) => {
    try {
        // Find all users who uploaded an ID and are waiting for review
        const pendingUsers = await User.find({ idVerificationStatus: 'pending' })
            .select('name email role idDocumentUrl createdAt');
        
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch pending users" });
    }
};

// --- ADMIN: APPROVE USER ---
export const approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { idVerificationStatus: 'verified' },
            { new: true }
        );
        res.status(200).json({ message: "User verified successfully!", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to approve user" });
    }
};

// --- ADMIN: REJECT USER ---
export const rejectUser = async (req, res) => {
    try {
        // If rejected, kick them back to unverified and clear the bad ID
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { idVerificationStatus: 'unverified', idDocumentUrl: "" },
            { new: true }
        );
        res.status(200).json({ message: "User rejected. They must upload a new ID.", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to reject user" });
    }
};

// --- TOGGLE SAVED PET ---
export const toggleSavePet = async (req, res) => {
    try {
        const userId = req.user.id; // From authMiddleware
        const { petId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the pet is already in the saved list
        const isSaved = user.savedPets.includes(petId);

        if (isSaved) {
            // If it's there, remove it (Unlike)
            user.savedPets = user.savedPets.filter(id => id.toString() !== petId);
        } else {
            // If it's not there, add it (Like)
            user.savedPets.push(petId);
        }

        await user.save();
        res.status(200).json(user.savedPets); // Return the updated list of IDs!
    } catch (error) {
        console.error("Error toggling saved pet:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// --- GET SAVED PETS LIST ---
export const getMySavedPets = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('savedPets');
        res.status(200).json(user.savedPets);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch saved pets" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        // .find({}) gets everyone. 
        // .select('-password') ensures we NEVER send passwords to the frontend!
        // .sort({ createdAt: -1 }) puts the newest users at the top of the list.
        const users = await User.find({})
            .select('-password') 
            .sort({ createdAt: -1 });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error while fetching users." });
    }
};

// 👇 Toggle Ban Status
export const toggleBanUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Prevent admins from accidentally banning themselves or other admins!
        if (user.role === 'admin') {
            return res.status(400).json({ message: "You cannot ban an admin account." });
        }

        user.isBanned = !user.isBanned; // Flip the status
        await user.save();

        res.status(200).json({ 
            message: `User successfully ${user.isBanned ? 'banned' : 'unbanned'}`,
            isBanned: user.isBanned
        });
    } catch (error) {
        console.error("Ban Error:", error);
        res.status(500).json({ message: "Server error while updating ban status." });
    }
};

// 👇 Permanently Delete User
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: "You cannot delete an admin account." });
        }

        await User.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: "User permanently deleted." });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Server error while deleting user." });
    }
};