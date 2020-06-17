require('dotenv').config()
const express = require('express');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const router = express.Router();

const uri = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL}`;

let result = null;
connect().then((db) => {
    result = db;
    console.log('messages.js connected to ' + process.env.DB_NAME + '.messages')
})

router.get('/messages', isLoggedIn, async (req, res) => {
    if (!req.query.id) return;
    let response = await result.aggregate([{
            $match: {
                $or: [{from: req.query.id}, {to: req.query.id}]
            }
        },
            {
                $addFields: {
                    "from": {$toObjectId: '$from'},
                    "to": {$toObjectId: '$to'}
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'fromuserdata'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'touserdata'
                }
            },
            {$unwind: {path: "$fromuserdata"}},
            {$unwind: {path: "$touserdata"}},{
            $project: {
                from: true,
                to: true,
                text: true,
                createdAt: true,
                seen:true,
                // "fromuserdata": false,
                // "touserdata": false,
                "fromuserdata.id": true,
                "fromuserdata.firstname": true,
                "fromuserdata.role": true,
                "touserdata.id": true,
                "touserdata.firstname": true,
                "touserdata.role": true,
            }
        }
    ]).sort({createdAt: -1}).toArray()
    res.send(response);
});

router.get('/unseencount', isLoggedIn, async (req, res) => {
    if (!req.query.id) return;
    let response = await result.aggregate([
        {
            $match: {
                to: req.query.id,
                seen: false
            }
        }, {
            $count:
            "unseen"
        }
    ]).toArray()
    res.send(response);
});

router.post('/', isLoggedIn, async (req, res) => {
    if (!req.body.id) {
        res.statusMessage = `No sender ID`
        res.status(401).send();
        return;
    }
    if (!req.body.to) {
        res.statusMessage = "No receiver ID"
        res.status(401).send();
        return;
    }
    if (!req.body.text) {
        res.statusMessage = "Please enter a message"
        res.status(401).send();
        return;
    }
    await result.insertOne({
        from: req.body.id,
        to: req.body.to,
        text: req.body.text,
        seen: false,
        createdAt: new Date(),
    }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.status(401).send();
    });
});

router.post('/markseen', isLoggedIn, async (req, res) => {
    if (!req.body.id) {
        res.statusMessage = `No sender ID`
        res.status(401).send();
        return;
    }
    if (!req.body.convo) {
        res.statusMessage = "No receiver ID"
        res.status(401).send();
        return;
    }
    await result.updateMany({
         "from" : req.body.convo,
        "to" : req.body.id
    },
        {
        $set: {
            seen: true
        }
    }).then(() => {
        res.status(201).send();
    }).catch((e) => {
        res.status(401).send();
    });
});


async function connect() {
    const client = await mongodb.MongoClient.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    return client.db(process.env.DB_NAME).collection('messages');
}

function isLoggedIn(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.SECRET_KEY
        );
        req.tokenData = decoded;
        if (req.tokenData.id === req.body.id || req.tokenData.id === req.query.id) {
            next();
        } else {
            res.statusMessage = 'Authentication failed'
            res.status(401).send();
        }
    } catch (err) {
        res.statusMessage = 'Authentication failed'
        res.status(401).send();
    }
}

module.exports = router;