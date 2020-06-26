const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.SECRET_KEY
        );
        req.tokenData = decoded;
        if (process.env.ADMINS.split(' ').includes(req.tokenData.id) && (req.tokenData.id === req.body.id || req.tokenData.id === req.query.id)) {
            next();
        } else {
            res.statusMessage = 'Successful authentication'
            res.status(201).send();
        }
    } catch (err) {
        res.statusMessage = 'Successful authentication'
        res.status(201).send();
    }
}
