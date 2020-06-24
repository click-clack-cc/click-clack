require('dotenv').config()
const express = require('express');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const router = express.Router();
isLoggedIn = require('../middleware/auth')
isAdmin = require('../middleware/admin')


const uri = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL}`;

let result = null;
connect().then((db) => {
    result = db;
    console.log('listings.js connected to ' + process.env.DB_NAME + '.listings')
})


router.get('/u', async (req, res) => {
    if (!req.query.user) return;
    if (req.query.user === '') return;
    let response = await result.find({
            user: req.query.user,
            state: "approved"
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
                name: true,
                description: true,
                category1: true,
                category2: true,
                type: true,
                new: true,
                createdAt: true,
                lastBump: true,
                images: true,
                premium: true,
                location: true,
                location2: true,
                state: true,
                shipping: true,
                condition: true,
                price: true,
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

        },
        {
            $match: {
                state: "approved"
            }
        }
    ]).limit(100)
        .sort({createdAt: -1})
        .toArray();
    res.send(response);
})

router.get('/mod', isAdmin, async (req, res) => {
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
                name: true,
                description: true,
                category1: true,
                category2: true,
                type: true,
                new: true,
                createdAt: true,
                lastBump: true,
                images: true,
                premium: true,
                location: true,
                location2: true,
                state: true,
                shipping: true,
                condition: true,
                price: true,
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

router.post('/filter', async (req, res) => {
    let match = {
        type: req.body.type === "looking" ? "buy" : "sell",
    }
    if (req.body.keywords) {
        match.$text = {$search: req.body.keywords}
    }
    match.price = {
        $gte: req.body.minPrice ? req.body.minPrice : 0,
        $lte: req.body.maxPrice ? req.body.maxPrice : 9999999
    }
    if (req.body.freeShipping === "buyer") match.freeShipping = "seller"
    if (req.body.category1) match.category1 = req.body.category1
    if (req.body.category2) match.category1 = req.body.category2
    if (req.body.location) match.location = req.body.location
    if (req.body.new) match.new = true
    let response = await result.aggregate([
        {
            $match: match
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
                name: true,
                description: true,
                category1: true,
                category2: true,
                type: true,
                new: true,
                createdAt: true,
                lastBump: true,
                images: true,
                state: true,
                premium: true,
                location: true,
                location2: true,
                shipping: true,
                condition: true,
                price: true,
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

        },
        {
            $match: {
                state: "approved"
            }
        }
    ]).limit(100)
        .sort({createdAt: -1}).toArray()
    res.send(response);
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
                name: true,
                description: true,
                category1: true,
                category2: true,
                type: true,
                new: true,
                createdAt: true,
                lastBump: true,
                images: true,
                premium: true,
                location: true,
                location2: true,
                shipping: true,
                state: true,
                condition: true,
                price: true,
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

        },
        {
            $match: {
                state: "approved"
            }
        }]).limit(100)
        .sort({createdAt: -1}).toArray()
    res.send(response);
});

router.post('/', isLoggedIn, async (req, res) => {
    let num = await result.find({_id: req.body.listing.name.replaceAll(' ', '-').replace(/[^a-zd-]/ig, '').toLowerCase()}).count();
    req.statusMessage = null
    if (!req.body.id) res.statusMessage = 'Failed to authenticate. Please try logging out and back in.'
    if (!req.body.listing.category1) res.statusMessage = 'Please choose a category for your listing'
    if (!req.body.listing.name) res.statusMessage = 'Please enter a name for your listing'
    if (!req.body.listing.price) res.statusMessage = 'Please set a price for your listing'
    if (!req.body.listing.description) res.statusMessage = 'Please enter a description for your listing'
    if (req.statusMessage) res.status(401).send();
    await result.insertOne({
        _id: (req.body.listing.name.replaceAll(' ', '-').replace(/[^a-zd-]/ig, '').toLowerCase()) + (num === 0 ? '' : (num + 1)),
        user: req.body.id,
        type: req.body.listing.type,
        category1: req.body.listing.category1,
        category2: req.body.listing.category2,
        name: req.body.listing.name,
        description: req.body.listing.description,
        lastBump: new Date(),
        images: req.body.listing.images,
        premium: false,
        location: req.body.listing.location,
        location2: req.body.listing.location2,
        shipping: req.body.listing.shipping,
        condition: req.body.listing.condition,
        state: "pending",
        price: req.body.listing.price,
        lastModified: new Date(),
        createdAt: new Date(),
    }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.status(401).send();
    });
});


router.post('/approve', isAdmin, async (req, res) => {
    await result.findOneAndUpdate(
        {
            _id: req.body.listing
        }, {
            $set: {
                state: "approved",
            }
        }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.status(401).send();
    });
});

router.post('/decline', isAdmin, async (req, res) => {
    await result.findOneAndUpdate(
        {
            _id: req.body.listing
        }, {
            $set: {
                state: "declined",
            }
        }).then(() => {
        res.status(201).send();
    }).catch(() => {
        res.status(401).send();
    });
});

router.post('/update', isLoggedIn, async (req, res) => {
    req.statusMessage = null
    if (!req.body.id) res.statusMessage = 'Failed to authenticate. Please try logging out and back in.'
    if (!req.body.listing.category1) res.statusMessage = 'Please choose a category for your listing'
    if (!req.body.listing.name) res.statusMessage = 'Please enter a name for your listing'
    if (!req.body.listing.price) res.statusMessage = 'Please set a price for your listing'
    if (!req.body.listing.description) res.statusMessage = 'Please enter a description for your listing'
    if (req.statusMessage) res.status(401).send();
    await result.findOneAndUpdate(
        {
            _id: req.body.listing._id
        }, {
            $set: {
                type: req.body.listing.type,
                category1: req.body.listing.category1,
                category2: req.body.listing.category2,
                name: req.body.listing.name,
                description: req.body.listing.description,
                images: req.body.listing.images,
                premium: false,
                location: req.body.listing.location,
                location2: req.body.listing.location2,
                shipping: req.body.listing.shipping,
                condition: req.body.listing.condition,
                state: "pending",
                price: req.body.listing.price,
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
        _id: req.body.listing
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

module.exports = router;