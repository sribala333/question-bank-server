const redisHelper = require('../utils/redisHelper');
const { verifyAccessToken } = require('../utils/tokenUtils'); 

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyAccessToken(token);

    const sessionId = req.headers['x-session-id']; // Custom header
    if (!sessionId) {
      return res.status(401).json({ message: 'No session ID provided' });
    }

    const userId = await redisHelper.get(`session:${sessionId}`);
    if (!userId) {
      return res.status(401).json({ message: 'Session expired' });
    }

    req.userId = decoded.userId;
    req.sessionId = sessionId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
