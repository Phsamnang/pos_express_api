// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const allowedEndpoints = [
        '/api/v1/login',
        '/api/v1/register'
    ];

    try {
        if (allowedEndpoints.includes(req.path)) {
            return next(); 
        }

        const authHeader = req.header('Authorization'); // Get the whole header

        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        // Now check if it starts with 'Bearer '
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
        }

        const token = authHeader.replace('Bearer ', ''); 
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next(); 

    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = authenticate;