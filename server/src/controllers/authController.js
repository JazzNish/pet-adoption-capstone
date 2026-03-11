import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


// Initialize Resend with your API key
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

// 👇 The new Brevo Transporter!
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});

const pendingUsers = new Map();

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

        // 👇 Sending the email via Brevo
        const mailOptions = {
            from: `"FurEver" <${process.env.BREVO_USER}>`, 
            to: email, // 👈 This will now work for ANY email address!
            subject: isNewUser ? 'Welcome to FurEver - Verification Code' : 'FurEver - Login Code',
            html: `<h2>${isNewUser ? 'Welcome to FurEver!' : 'Welcome back!'}</h2>
                   <p>Your secure 6-digit code is: <strong>${otpCode}</strong></p>
                   <p>This code will expire in 10 minutes.</p>`
        };
        
        await transporter.sendMail(mailOptions);

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