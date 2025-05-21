const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Attach decoded payload to request
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
