require('dotenv').config()
const express = require('express');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const router = express.Router();
isLoggedIn = require('../middleware/auth')

const uri = `${process.env.DB_CONNECT_URL_PREFIX}${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL_POSTFIX}`;

let result = null;
connect().then((db) => {
    result = db;
    console.log('messages.js connected to ' + process.env.DB_NAME + '.messages')
}).catch((err) => {
    console.error('messages.js could not connect to ' + process.env.DB_NAME + '.messages: ' + err)
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

module.exports = router;