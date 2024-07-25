const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY; // Assuming your secret is stored in an environment variable
require('dotenv').config();

  // Middleware to authenticate token
  const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader); // Log header Authorization
    if (!authHeader) {
      console.log('Authorization header is missing');
      return res.status(401).json({ message: 'Authorization header is missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    console.log('Received token:', token);
    try {
      const verified = jwt.verify(token, secret);
      req.user = verified;
      console.log('Token is valid, user verified:', verified);
      next();
    } catch (error) {
      console.log('Invalid token:', error.message);
      res.status(401).json({ message: 'Invalid token', error: error.message });
    }
  };

  module.exports = authenticateToken;
