// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const allowedEndpoints=[
        '/api/v1/login',
        '/api/v1/register'
    ]
    
  try {
    if (allowedEndpoints.includes(req.path)) {
        return next(); 
      }
    const token = req.header('Authorization').replace('Bearer ', ''); 

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; 
    next(); 
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = authenticate;