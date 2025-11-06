/**
 * Authentication Middleware
 *
 * Verifies user session and attaches user info to req.user for downstream handlers.
 * Uses session-based authentication instead of JWT.
 */

export const authenticate = async (req, res, next) => {
    try {
        // Check if session exists and has userId
        if (!req.session || !req.session.userId) {
            return res.status(401).json({
                message: 'Authentication required. Please login.'
            });
        }

        // Attach user info to request object from session
        req.user = {
            id: req.session.userId,
            username: req.session.username,
            email: req.session.email
        };

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Authentication error',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
};