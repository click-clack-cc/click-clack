require('dotenv').config()
const express = require('express');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const router = express.Router();

const uri = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL}`;

let result = null;
connect().then((db) => {
    result = db;
    console.log('posts.js connected to ' + process.env.DB_NAME + '.posts')
})


router.get('/u', async (req, res) => {
    if (!req.query.user) return;
    if (req.query.user === '') return;
    let response = await result.find({
        user: req.query.user,
    }).limit(100)
        .sort({lastModified: -1}).toArray()
    res.send(response);
});

router.get('/own', async (req, res) => {
    if (!req.query.user) return;
    if (req.query.user === '') return;
    let response;
    response = await result.find({
        user: req.query.user
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
                _id: true,
                user: true,
                title: true,
                content: true,
                createdAt: true,
                hearts: true,
                url: true,
                comments: true,
                images: true,
                lastModified: true,
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
})

router.get('/best', async (req, res) => {
    let response = await result.aggregate([
        {
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
                _id: true,
                user: true,
                title: true,
                content: true,
                createdAt: true,
                hearts: true,
                comments: true,
                images: true,
                url: true,
                lastModified: true,
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
                _id: true,
                user: true,
                title: true,
                content: true,
                createdAt: true,
                hearts: true,
                comments: true,
                url: true,
                images: true,
                lastModified: true,
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

router.post('/comment', isLoggedIn, async (req, res) => {
    try {
        await result.findOneAndUpdate({
                _id: mongodb.ObjectId(req.body.post)
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
                _id: req.body.post
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
});

router.post('/heart', isLoggedIn, async (req, res) => {
    try {
        await result.findOneAndUpdate({
                _id: mongodb.ObjectId(req.body.post)
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
                _id: req.body.post
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
});

router.get('/search/', async (req, res) => {
    if (!req.query.text) return;
    if (req.query.text === '') return;
    let response = await result.aggregate([{
        $match: {
            $text: {
                $search: req.query.text
            }
        }
    }, {
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
                _id: true,
                user: true,
                title: true,
                content: true,
                url: true,
                hearts: true,
                comments: true,
                createdAt: true,
                images: true,
                lastModified: true,
                userdata: {
                    id: true,
                    firstname: true
                },
            }
        },
        {
            $unwind:
                "$userdata"
        }]).limit(100)
        .sort({createdAt: -1}).toArray()
    res.send(response);
});

router.post('/', isLoggedIn, async (req, res) => {
    let num = await result.find({_id: req.body.post.title.replace(/ /g, '-').replace(/[^a-zd-]/ig, '').toLowerCase()}).count();
    req.statusMessage = null
    if (!req.body.id) res.statusMessage = 'Failed to authenticate. Please try logging out and back in.'
    if (!req.body.post.title) res.statusMessage = 'Please choose a title for your post'
    if (!req.body.post.content) res.statusMessage = 'Please enter some content for your post'
    if (req.statusMessage) res.status(401).send();
    await result.insertOne({
        _id: (req.body.post.title.replace(/ /g, '-').replace(/[^a-zd-]/ig, '').toLowerCase()) + (num === 0 ? '' : (num + 1)),
        user: req.body.id,
        title: req.body.post.title,
        content: req.body.post.content,
        images: req.body.post.images,
        url: req.body.post.url,
        hearts: [],
        comments: [],
        lastModified: new Date(),
        createdAt: new Date(),
    }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.status(401).send();
    });
});


router.post('/update', isLoggedIn, async (req, res) => {
    req.statusMessage = null
    if (!req.body.id) res.statusMessage = 'Failed to authenticate. Please try logging out and back in.'
    if (!req.body.post.title) res.statusMessage = 'Please choose a title for your post'
    if (!req.body.post.content) res.statusMessage = 'Please enter some content for your post'
    if (req.statusMessage) res.status(401).send();
    await result.findOneAndUpdate(
        {
            _id: req.body.post._id
        }, {
            $set: {
                title: req.body.post.title,
                content: req.body.post.content,
                images: req.body.post.images,
                url: req.body.post.url,
                lastModified: new Date()
            }
        }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.status(401).send();
    });
});

router.post('/delete', isLoggedIn, async (req, res) => {
    await result.deleteOne({
        _id: req.body.post
    }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.statusMessage = 'Failed to remove post'
        res.status(401);
    });
});

async function connect() {
    const client = await mongodb.MongoClient.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    return client.db(process.env.DB_NAME).collection('posts');
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