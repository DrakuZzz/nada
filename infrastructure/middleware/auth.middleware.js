function CreateAuthMiddleware(authService, userRepository) {
    return async (req, res, next) => {
        try {
        const authHeader = req.headers('authorization').replace('Bearer ', '');
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded =  authService.verifyToken(authHeader);
        const user = await userRepository.findById(decoded.user);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        req.user = user.toJSON();
        next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    
    }
}

export default  CreateAuthMiddleware;