const User = require("../model/user");
const bcrypt = require('bcryptjs'); // Import bcrypt
const jwt = require('jsonwebtoken')
require('dotenv').config()
exports.register = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create the new user
      const newUser = await User.create({
        email,
        password: hashedPassword 
        // ... other fields as needed
      });
  
      // Generate JWT token (make sure process.env.JWT_SECRET is set)
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
  
      res.status(201).json({ token }); // Send the token in the response
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ error: 'Unable to register user' }); 
    }
  };

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({   
   error: 'Invalid email or password' });
      }
  
    
      const passwordMatch = await bcrypt.compare(password,user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Password is incorrect!' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn:   
   '1h' }); 
  
      res.json({ token });
    } catch (err) {
      console.error(err);   
  
      res.status(500).json({ error: 'Unable to log in' });
    }
  };