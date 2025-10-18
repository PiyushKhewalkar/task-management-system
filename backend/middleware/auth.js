import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

export function auth(req, res, next) {
  // 1. Get token from the Authorization header
  const authHeader = req.headers["authorization"];

  // Header format: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // 2. Verify token
    const secretKey = process.env.JWT_SECRET; // Make sure this is set in your .env
    const decoded = jwt.verify(token, secretKey);

    // 3. Attach user info to request
    req.user = decoded;

    // 4. Continue to the next middleware/route
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(403).json({ message: "Invalid or expired token." });
  }
}
