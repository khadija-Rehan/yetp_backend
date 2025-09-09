const adminApiKeyMiddleware = (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    
    if (!apiKey) {
        return res.status(401).json({ message: 'API key is required' });
    }

    // Check if the API key matches the admin API key in environment variables
    if (apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ message: 'Invalid API key' });
    }

    next();
};

module.exports = adminApiKeyMiddleware;
