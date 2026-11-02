const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Role Bouncer says: You are a ${req.user.role}. Only ${allowedRoles.join(' or ')} can do this!` 
      });
    }
    next();
  };
};

module.exports = authorizeRoles;