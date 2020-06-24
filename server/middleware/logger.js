module.exports = function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null)

    id = null
    if (req.query && req.query.id) id = req.query.id;
    if (req.body && req.body.id) id = req.body.id;

    console.log("requestlog", `${ip}:${id}> ${req.originalUrl}`)
    next();
}