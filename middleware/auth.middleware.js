// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
  try {
    let token;
    
    // First check cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    
    // Then check Authorization header
    const authHeader = req.header('Authorization') || req.headers.authorization;
    if (!token && authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      } else {
        // Handle case where token is sent without 'Bearer ' prefix
        token = authHeader;
      }
    }
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized: No token provided',
        details: 'Token must be provided in cookies or Authorization header'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    // Find the user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Error in protectRoute middleware:', error);
    
    // More specific error handling
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Unauthorized: Invalid token',
        details: 'Token is malformed or invalid'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Unauthorized: Token expired',
        details: 'Please login again'
      });
    } else {
      return res.status(401).json({ 
        error: 'Unauthorized: Authentication failed',
        details: error.message
      });
    }
  }
};

// Admin middleware - checks if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // This middleware should run after protectRoute
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized: User not authenticated',
        details: 'Please ensure protectRoute middleware runs before isAdmin'
      });
    }
    
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden: Admin access required',
        details: 'You do not have permission to access this resource'
      });
    }
    next();
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: 'Error checking admin privileges'
    });
  }
};

export default protectRoute;
export { isAdmin };