// middlewares/roleMiddleware.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if the user's role (which the first Bouncer pulled from the token) is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Role Bouncer says: You are a ${req.user.role}. Only ${allowedRoles.join(' or ')} can do this!` 
      });
    }
    
    // If they have the right role, let them through to the Waiter!
    next();
  };
};

module.exports = authorizeRoles;