const checkRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (roles.includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden" });
};

module.exports = checkRole;