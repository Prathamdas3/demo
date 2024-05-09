function verifyAdmin(req, res, next) {
  
    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "Access denied. You need Admin role to get access." });
    }
    next();
  }

module.exports = verifyAdmin;