import User from '../models/User.js';


export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdopters = await User.countDocuments({ role: 'adopter' });
        const totalRehomers = await User.countDocuments({ role: 'rehomer' });
        const bannedUsers = await User.countDocuments({ isBanned: true });
        
        // We will add pet stats here later!
        // const totalPets = await Pet.countDocuments();

        res.status(200).json({
            users: totalUsers,
            adopters: totalAdopters,
            rehomers: totalRehomers,
            banned: bannedUsers
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Server error while fetching stats." });
    }
};