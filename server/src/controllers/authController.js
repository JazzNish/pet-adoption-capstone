import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};


const pendingUsers = new Map();

export const googleAuth = async (req, res) => {
    try {
        const { name, email, role, imageUrl } = req.body; 
        let user = await User.findOne({ email });

        // 👇 1. IF THE USER ALREADY EXISTS
        if (user) {
            // Check if they are banned before letting them in
            if (user.isBanned) {
                return res.status(403).json({ 
                    message: "This account has been suspended by an administrator. Please contact support." 
                });
            }

            // Update profile picture if they have a new one from Google
            if (imageUrl && !user.profilePicture) {
                user.profilePicture = imageUrl;
                await user.save();
            }
        } 
        // 👇 2. IF THE USER DOES NOT EXIST (New Signup)
        else {
            if (!role) {
                return res.status(403).json({ 
                    requireSignup: true, 
                    message: "Account not found. Please sign up to choose your role." 
                });
            }

            // Create the brand new user (no need to check for bans here!)
            user = await User.create({ 
                name, 
                email, 
                role: role, 
                isEmailVerified: true,
                profilePicture: imageUrl
            });
        }

        // 👇 3. LOG THEM IN
        res.status(200).json({
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                profilePicture: user.profilePicture 
            },
            token: generateToken(user._id) 
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Server error during Google auth" });
    }
};

// 👇 The new streamlined Firebase Email Login
export const firebaseEmailLogin = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Find the user in your MongoDB database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Account not found. Please sign up first." });
        }

        if (user.isBanned) {
            return res.status(403).json({ 
                message: "This account has been suspended by an administrator. Please contact support." 
            });
        }

        // If found, send back their profile and a fresh token!
        res.status(200).json({
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                profilePicture: user.profilePicture 
            },
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error("Firebase Login Sync Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};

// 👇 The Secret Admin Portal Login
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Define your Master Credentials here
        const MASTER_USER = "furever_admin";
        const MASTER_PASS = "panel_demo_123";

        if (username === MASTER_USER && password === MASTER_PASS) {
            // Create a temporary admin profile for the frontend
            const adminProfile = {
                id: "master-admin-001",
                name: "System Admin",
                email: "admin@furever.app",
                role: "admin",
                profilePicture: ""
            };

            // Hand them a valid token so the site lets them in
            res.status(200).json({
                user: adminProfile,
                token: generateToken(adminProfile.id)
            });
        } else {
            res.status(401).json({ message: "Invalid admin credentials." });
        }

    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ message: "Server error." });
    }
};