import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-fallback-super-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Generate a JWT token containing Tenant and User info
 * @param {Object} payload - Data to embed in the JWT (e.g. { tenantId, email, role })
 * @returns {string} - JWT Token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify a JWT token
 * @param {string} token - The token string
 * @returns {Object} - Decoded payload
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
