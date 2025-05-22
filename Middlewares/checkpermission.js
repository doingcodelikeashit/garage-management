const jwt = require("jsonwebtoken");
const User = require("../Model/user.model");

const checkPermission = (requiredPermissions = []) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ message: "User not found" });

      // Always allow super-admin
      if (user.role === "super-admin") {
        req.user = user;
        return next();
      }

      // Check for any of the required permissions
      const hasPermission = requiredPermissions.some((perm) =>
        user.permissions.includes(perm)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Permission denied" });
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = checkPermission;
