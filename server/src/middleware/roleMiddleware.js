const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user is set by your authMiddleware right before this runs!
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. You do not have permission." });
        }
        next(); // You are an admin, go ahead!
    };
};

export default roleMiddleware;