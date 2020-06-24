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
    console.log('keyboards.js connected to ' + process.env.DB_NAME + '.keyboards')
})

router.get('/u', async (req, res) => {
    if (!req.query.user) return;
    if (req.query.user === '') return;
    let response = await result.find({
        owner: req.query.user
    }).limit(100)
        .sort({lastModified: -1}).toArray()
    res.send(response);
});

router.get('/id', async (req, res) => {
    if (!req.query.id) return;
    if (req.query.id === '') return;
    try {
        let response = await result.find({
            _id: mongodb.ObjectID(req.query.id)
        }).limit(100).toArray()
        res.send(response);
    } catch (e) {
        let response = await result.find({
            _id: req.query.id
        }).limit(100)
            .sort({lastModified: -1}).toArray()
        res.send(response);
    }
});

router.get('/new', async (req, res) => {
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
                creatorName: true,
                url: true,
                comments: true,
                hearts: true,
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
                creatorName: true,
                url: true,
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
                creatorName: true,
                url: true,
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
    let num = await result.find({_id: req.body.keyboard.name.replace(/ /g, '-').replace(/[^a-zd-]/ig, '').toLowerCase()}).count();
    await result.insertOne({
        _id: (req.body.keyboard.name.replace(/ /g, '-').replace(/[^a-zd-]/ig, '').toLowerCase()) + (num === 0 ? '' : (num + 1)),
        owner: req.body.id,
        name: req.body.keyboard.name,
        description: req.body.keyboard.description,
        layout: req.body.keyboard.layout,
        switches: req.body.keyboard.switches,
        keycaps: req.body.keyboard.keycaps,
        pcb: req.body.keyboard.pcb,
        case: req.body.keyboard.case,
        images: req.body.keyboard.images,
        creatorName: req.body.keyboard.creatorName,
        url: req.body.keyboard.url,
        comments: [],
        hearts: [],
        lastModified: new Date(),
        createdAt: new Date()
    }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.statusMessage = 'Failed to add keyboard'
        res.status(401);
    });
});


router.post('/update', isLoggedIn, async (req, res) => {
    await result.findOneAndUpdate({
            _id: req.body.keyboard._id
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
                creatorName: req.body.keyboard.creatorName,
                url: req.body.keyboard.url,
                lastModified: new Date()
            }
        }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.statusMessage = 'Failed to update keyboard'
        res.status(401);
    });
});

router.post('/delete', isLoggedIn, async (req, res) => {
    await result.deleteOne({
        _id: req.body.keyboard
    }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.statusMessage = 'Failed to update keyboard'
        res.status(401);
    });
});

router.post('/comment', isLoggedIn, async (req, res) => {
    if (req.body.id !== 'test') {
        try {
            await result.findOneAndUpdate({
                    _id: mongodb.ObjectId(req.body.keyboard)
                },
                {
                    $push: {
                        comments: {
                            submitter: req.body.id,
                            text: req.body.text,
                            createdAt: new Date()
                        }
                    }
                });
            res.status(201).send();
        } catch (e) {
            await result.findOneAndUpdate({
                    _id: req.body.keyboard
                },
                {
                    $push: {
                        comments: {
                            submitter: req.body.id,
                            text: req.body.text,
                            createdAt: new Date()
                        }
                    }
                });
            res.status(201).send();
        }
    } else {
        res.statusMessage("Unexpected server error");
        res.status(401).send();
    }
});

router.post('/heart', isLoggedIn, async (req, res) => {
    if (req.body.id !== 'test') {
        try {
            await result.findOneAndUpdate({
                    _id: mongodb.ObjectId(req.body.keyboard)
                },
                {
                    $addToSet: {
                        hearts: {
                            submitter: req.body.id,
                            createdAt: new Date()
                        }
                    }
                });
            res.status(201).send();
        } catch (e) {
            await result.findOneAndUpdate({
                    _id: req.body.keyboard
                },
                {
                    $addToSet: {
                        hearts: {
                            submitter: req.body.id,
                            createdAt: new Date()
                        }
                    }
                });
            res.status(201).send();
        }
    } else {
        res.statusMessage("Unexpected server error");
        res.status(401).send();
    }
});

async function connect() {
    const client = await mongodb.MongoClient.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    return client.db(process.env.DB_NAME).collection('keyboards');
}

module.exports = router;