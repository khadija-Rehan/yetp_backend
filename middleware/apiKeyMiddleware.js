const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    
    if (!apiKey) {
        return res.status(401).json({ message: 'API key is required' });
    }

    // Check if the API key matches the one in environment variables
    if (apiKey !== process.env.BANK_API_KEY) {
        return res.status(403).json({ message: 'Invalid API key' });
    }

    next();
};

module.exports = apiKeyMiddleware; 