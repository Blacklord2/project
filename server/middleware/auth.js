const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dobetter-secret-change-in-production';

/**
 * Middleware: verify JWT token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorised — no token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email, fullName }
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorised — invalid or expired token' });
  }
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, fullName: user.full_name || user.fullName },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { requireAuth, signToken };
