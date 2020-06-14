require('dotenv').config()
const express = require('express');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const router = express.Router();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL}`;

let result = null;
connect().then((db) => {
    result = db;
    console.log('listings.js connected to ' + process.env.DB_NAME + '.listings')
})

router.get('/new', async (req, res) => {
    let response = await result.aggregate([{
        $addFields: {
            "user": {$toObjectId: 'user'}
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
                _id: true,
                user: true,
                title: true,
                type: true,
                category1: true,
                category2: true,
                new: true,
                createdAt: true,
                lastBump: true,
                images: true,
                premium: true,
                location: true,
                shipping: true,
                state: true,
                price: true,
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
    ]).limit(100)
        .sort({createdAt: -1})
        .toArray();
    res.send(response);
});

router.get('/best', async (req, res) => {
    let response = await result.aggregate([{
        $addFields: {
            "owner": {$toObjectId: '$owner'}
        }
    },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'userdata'
            }
        },
        {
            $project: {
                _id: true,
                owner: true,
                name: true,
                description: true,
                layout: true,
                switches: true,
                keycaps: true,
                pcb: true,
                case: true,
                images: true,
                lastModified: true,
                createdAt: true,
                comments: true,
                hearts: true,
                userdata: {
                    id: true,
                    firstname: true
                },
                heartsNum: {"$size": "$hearts"}
            }
        },
        {
            $unwind:
                "$userdata"

        }
    ]).limit(100)
        .sort({heartsNum: -1})
        .toArray();
    res.send(response);
});

router.get('/rising', async (req, res) => {
    let response = await result.aggregate([
        {
            $match:
                {
                    createdAt: {
                        $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
                    }
                }
        },
        {
            $addFields: {
                "owner": {$toObjectId: '$owner'}
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'userdata'
            }
        },
        {
            $project: {
                _id: true,
                owner: true,
                name: true,
                description: true,
                layout: true,
                switches: true,
                keycaps: true,
                pcb: true,
                case: true,
                images: true,
                lastModified: true,
                createdAt: true,
                comments: true,
                hearts: true,
                userdata: {
                    id: true,
                    firstname: true
                },
                heartsNum: {"$size": "$hearts"}
            }
        },
        {
            $unwind:
                "$userdata"

        }
    ]).limit(100)
        .sort({heartsNum: -1})
        .toArray();
    res.send(response);
});

router.get('/search/', async (req, res) => {
    if (!req.query.text) return;
    if (req.query.text === '') return;
    let response = await result.find({
        $text: {
            $search: req.query.text
        }
    }).limit(100)
        .sort({createdAt: -1}).toArray()
    res.send(response);
});

router.post('/', isLoggedIn, async (req, res) => {
    console.log(req.body)
    let num = await result.find({_id: req.body.listings.name.replace(' ', '-').replace(/[^a-zd-]/ig, '').toLowerCase()}).count();
    await result.insertOne({
        _id: (req.body.keyboard.name.replace(' ', '-').replace(/[^a-zd-]/ig, '').toLowerCase()) + (num === 0 ? '' : (num + 1)),
        owner: req.body.id,
        name: req.body.keyboard.name,
        description: req.body.keyboard.description,
        layout: req.body.keyboard.layout,
        switches: req.body.keyboard.switches,
        keycaps: req.body.keyboard.keycaps,
        pcb: req.body.keyboard.pcb,
        case: req.body.keyboard.case,
        images: req.body.keyboard.images,
        comments: [],
        hearts: [],
        lastModified: new Date(),
        createdAt: new Date()
    }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.statusMessage = 'Failed to add listings'
        res.status(401);
    });
});


router.post('/update', isLoggedIn, async (req, res) => {
    await result.findOneAndUpdate({
            _id: req.body.listings._id
        },
        {
            $set: {
                description: req.body.keyboard.description,
                layout: req.body.keyboard.layout,
                switches: req.body.keyboard.switches,
                keycaps: req.body.keyboard.keycaps,
                pcb: req.body.keyboard.pcb,
                case: req.body.keyboard.case,
                images: req.body.keyboard.images,
                lastModified: new Date()
            }
        }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.statusMessage = 'Failed to update listings'
        res.status(401);
    });
});

router.post('/delete', isLoggedIn, async (req, res) => {
    await result.deleteOne({
        _id: req.body.listings
    }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.statusMessage = 'Failed to update listings'
        res.status(401);
    });
});

async function connect() {
    const client = await mongodb.MongoClient.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    return client.db(process.env.DB_NAME).collection('listings');
}

function isLoggedIn(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.SALT
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