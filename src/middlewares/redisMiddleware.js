// middleware/redisMiddleware.js
const redisClient = require('../config/redis');

const ensureRedisReady = (req, res, next) => {
    if (redisClient.connected) {
        return next();
    } else {
        const onConnect = () => {
            redisClient.removeListener('error', onError);
            next();
        };

        const onError = (err) => {
            console.error('Redis connection error:', err);
            redisClient.removeListener('connect', onConnect);
            res.status(500).json({ message: 'Redis connection error' });
        };

        redisClient.once('connect', onConnect);
        redisClient.once('error', onError);
    }
};

module.exports = ensureRedisReady;
