require('dotenv').config()
let clients = []
let all = 0

setInterval(function () {
    if(all <= process.env.MAX_REQUESTS_PER_MINUTE) {
        console.log('guard',`Requests in the past minute ${all}/${process.env.MAX_REQUESTS_PER_MINUTE} - OK`)
    } else {
        console.error('guard',`Requests in the past minute ${all}/${process.env.MAX_REQUESTS_PER_MINUTE} - !! NOT OK !!`)
    }
    clients = []
    all = 0
}, 60000)

module.exports = function (req, res, next) {

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null)

    if(clients[ip]) {
        clients[ip] ++
        all++
    } else {
        clients[ip] = 1;
    }

    if(clients[ip] > process.env.MAX_REQUESTS_PER_MINUTE_PER_USER) {
        res.statusMessage = "Please slow down"
        console.error('guard', `Requests in the past minute from ${clients[ip]} : ${all}/${process.env.MAX_REQUESTS_PER_MINUTE_PER_USER} - !! NOT OK !!`)
        res.status(401).send();
    } else if(clients[ip] > process.env.MAX_REQUESTS_PER_MINUTE) {
        res.statusMessage = "Server temporarily closed due to overload"
        res.status(401).send();
    } else next();
}