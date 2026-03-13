import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            // 👇 THE CRITICAL FIX: The Master Admin Bypass
            if (decoded.id === 'master-admin-001') {
                // Attach a temporary admin profile to the request
                req.user = { _id: 'master-admin-001', role: 'admin' };
                return next(); // Skip the database lookup and move on!
            }

            // 3. Normal User Flow: Fetch the user from the database
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User no longer exists' });
            }

            next(); // Move on to the next middleware (which is your roleMiddleware!)
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export default authMiddleware;