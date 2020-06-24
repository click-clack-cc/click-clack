const jwt = require('jsonwebtoken');
require('dotenv').config()
const mongodb = require('mongodb');
const uri = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL}`;
let users = null;

connect().then((db) => {
    users = db;
    console.log('auth.js connected to ' + process.env.DB_NAME + '.users')
})

async function connect() {
    const client = await mongodb.MongoClient.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    return client.db(process.env.DB_NAME).collection('users');
}

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.SECRET_KEY
        );
        req.tokenData = decoded;
        if (req.tokenData.id === req.body.id || req.tokenData.id === req.query.id) {

            users.findOneAndUpdate({
                    _id: mongodb.ObjectId(req.tokenData.id)
                },
                {
                    $set: {
                        lastLogIn: new Date()
                    }
                })

            next()
        } else {
            res.statusMessage = 'Authentication failed'
            res.status(401).send();
        }
    } catch (err) {
        res.statusMessage = 'Authentication failed'
        res.status(401).send();
    }
}