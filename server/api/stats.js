require('dotenv').config()
const express = require('express');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const router = express.Router();
isLoggedIn = require('../middleware/auth')

const uri = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL}`;

let result = null;
connect().then((db) => {
    result = db;
    console.log('stats.js connected to ' + process.env.DB_NAME + '.stats')
})

let users = null;
connectUsers().then((db) => {
    users = db;
    console.log('stats.js connected to ' + process.env.DB_NAME + '.users')
})

router.get('/', async (req, res) => {
    if (req.query.id !== undefined) {
        res.send(await result
            .find({user: req.query.id})
            .sort({createdAt: -1}).toArray());
    } else {
        res.send(await result.aggregate([{
            $addFields: {
                "user": {$toObjectId: '$user'}
            }
        },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userdata'
                }
            },
            {
                $project: {
                    user: true,
                    wct: true,
                    wpm: true,
                    keyboard: true,
                    difficulty: true,
                    acc: true,
                    createdAt: true,
                    userdata: {
                        id: true,
                        firstname: true
                    },
                }
            },
            {
                $unwind:
                    "$userdata"

            }
        ]).limit(1000)
            .sort({createdAt: -1})
            .toArray());
    }
});

router.get('/leaderboard', async (req, res) => {
        res.send(await result.aggregate([
            {
                '$group': {
                    '_id': '$user',
                    'tests': {
                        '$sum': 1
                    },
                    'avg': {
                        '$avg': {
                            '$multiply': [
                                '$wpm', '$acc', 0.01
                            ]
                        }
                    }
                }
            }, {
                '$sort': {
                    'avg': -1
                }
            }, {
                '$set': {
                    '_id': {
                        '$convert': {
                            'input': '$_id',
                            'to': 'objectId'
                        }
                    }
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'user'
                }
            }, {
                '$set': {
                    'user': {
                        '$arrayElemAt': [
                            '$user', 0
                        ]
                    }
                }
            }, {
                '$match': {
                    'tests': {
                        '$gt': 4
                    }
                }
            }, {
                '$limit': 10
            }
        ]).toArray());
    }
);

router.post('/', isLoggedIn, async (req, res) => {
    if (req.body.stat.acc < 80) {
        res.statusMessage = 'Accuracy below 80%'
        res.status(401).send();
        return;
    }
    if (req.body.stat.acc > 100) {
        res.status(401).send();
        return;
    }
    if (req.body.stat.wpm > 250) {
        res.status(401).send();
        return;
    }

    if (req.body.stat.wpm >= 100) {
        await users.update({
                _id: mongodb.ObjectId(req.body.id)
            },
            {
                $addToSet: {
                    achievements: '100wpm'
                }
            }, function (err, doc) {
                if (err) {
                    throw err;
                }
            });
    } else if (req.body.stat.wpm >= 125) {
        await users.update({
                _id: mongodb.ObjectId(req.body.id)
            },
            {
                $addToSet: {
                    achievements: '125wpm'
                }
            }, function (err, doc) {
                if (err) {
                    throw err;
                }
            });
    }

    if (await result
        .find({user: req.body.id}).count() >= 100) {
        await users.update({
                _id: mongodb.ObjectId(req.body.id)
            },
            {
                $push: {
                    achievements: '100tests'
                }
            }, function (err, doc) {
                if (err) {
                    throw err;
                }
            });
    }

    await result.insertOne({
        user: req.body.id,
        keyboard: req.body.stat.keyboard,
        difficulty: req.body.stat.difficulty,
        wct: req.body.stat.wct,
        wpm: req.body.stat.wpm,
        acc: req.body.stat.acc,
        createdAt: new Date()
    }).then(() => {
        res.status(201).send();
    });
});

async function connect() {
    const client = await mongodb.MongoClient.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    return client.db(process.env.DB_NAME).collection('stats');
}

async function connectUsers() {
    const client = await mongodb.MongoClient.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    return client.db(process.env.DB_NAME).collection('users');
}

module.exports = router;