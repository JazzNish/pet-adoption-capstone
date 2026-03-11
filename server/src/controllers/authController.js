import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';


// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

// 🚀 THE WAITING ROOM
const pendingUsers = new Map();

// --- THE NEW RESEND OTP FUNCTION ---
export const sendOtpCode = async (req, res) => {
    try {
        const { email, role } = req.body;

        const existingUser = await User.findOne({ email });
        const isNewUser = !existingUser;

        if (isNewUser && !role) {
            return res.status(400).json({ message: "Please select an account type to sign up." });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        pendingUsers.set(email, {
            email,
            role: isNewUser ? role : existingUser.role,
            isNewUser,
            otpCode,
            expiresAt: Date.now() + 10 * 60 * 1000 
        });

        // 🌟 THE MAGIC API CALL 🌟
        const { data, error } = await resend.emails.send({
            from: 'FurEver App <onboarding@resend.dev>', // 👈 Must use this exact email for the free tier!
            to: email, // 👈 Must be the same email you used to sign up for Resend!
            subject: isNewUser ? 'Welcome to FurEver - Verification Code' : 'FurEver - Login Code',
            html: `<h2>${isNewUser ? 'Welcome to FurEver!' : 'Welcome back!'}</h2>
                   <p>Your secure 6-digit code is: <strong>${otpCode}</strong></p>
                   <p>This code will expire in 10 minutes.</p>`
        });

        if (error) {
            console.error("Resend API Error:", error);
            return res.status(500).json({ message: "Failed to send email via Resend" });
        }

        res.status(200).json({ message: "Verification email sent", email });

    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ message: "Server error during OTP generation" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const pendingUser = pendingUsers.get(email);

        if (!pendingUser) return res.status(400).json({ message: "Session expired. Please request a new code." });
        if (Date.now() > pendingUser.expiresAt) {
            pendingUsers.delete(email);
            return res.status(400).json({ message: "Code expired. Please request a new code." });
        }
        if (pendingUser.otpCode !== code) return res.status(400).json({ message: "Invalid verification code" });

        let user;

        // ✅ If they are new, CREATE the account now
        if (pendingUser.isNewUser) {
            user = await User.create({
                name: "FurEver Member", // Default name!
                email: pendingUser.email,
                role: pendingUser.role,
                isEmailVerified: true 
            });
        } else {
            // ✅ If they are returning, just grab their existing account
            user = await User.findOne({ email: pendingUser.email });
        }

        pendingUsers.delete(email); // Free up memory

        res.status(200).json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Server error during verification" });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { name, email, role, imageUrl } = req.body; 
        let user = await User.findOne({ email });

        if (!user) {
            // 🚨 NEW: If they try to log in from the Log In page (no role selected), STOP THEM!
            if (!role) {
                return res.status(403).json({ 
                    requireSignup: true, 
                    message: "Account not found. Please sign up to choose your role." 
                });
            }

            // Otherwise, they are coming from the Sign Up page where they safely picked a role!
            user = await User.create({ 
                name, 
                email, 
                role: role, 
                isEmailVerified: true,
                profilePicture: imageUrl
            });
        } else if (imageUrl && !user.profilePicture) {
            user.profilePicture = imageUrl;
            await user.save();
        }

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