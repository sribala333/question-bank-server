const redisHelper = require('../utils/redisHelper');

const getCurrentUser = async (req, res, next) => {
    try {
        const userId = await redisHelper.get('userId');
        if (!userId) {
            return res.status(401).json({ message: 'Session expired. Please login again.' });
        }
        req.userId = JSON.parse(userId);
        next();
    } catch (error) {
        console.error('Error in getCurrentUser middleware:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = getCurrentUser;
