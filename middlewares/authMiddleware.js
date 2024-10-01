
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).send('Access denied.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log({decoded})
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};
