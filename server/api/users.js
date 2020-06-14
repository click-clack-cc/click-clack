require('dotenv').config()
const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const salt = 10

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL}`;

let result = null;
connect().then((db) => {
    result = db;
    console.log('users.js connected to ' + process.env.DB_NAME + '.users')
})


router.post('/register', async (req, res) => {
    let usernamefree = await result.find({id: req.body.id}).count() === 0;
    let emailfree = await result.find({email: req.body.email}).count() === 0;
    if (usernamefree && emailfree && validateUsername(req.body.id)) {
        bcrypt.hash(req.body.password, salt, (err, encrypted) => {
            let user = {
                id: req.body.id,
                email: req.body.email,
                img: "",
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                bio: `Hello everyone, it's me, ${req.body.firstname}!`,
                keyboards: [],
                recommendations: [],
                achievements: [],
                role: 'user',
                password: encrypted,
                createdAt: new Date(),
                lastLogIn: new Date()
            }

            result.insertOne(user);

            const token = jwt.sign({
                    id: user._id
                },
                process.env.SALT, {
                    expiresIn: '7d'
                }
            );

            user.password = undefined;

            res.status(200).send({
                token: token,
                user: user
            });
        });
    } else {
        res.statusMessage = 'This username or email is already in use'
        res.status(304).send();
    }
});

router.post('/login', async (req, response) => {
    let user = null;
    if (req.body.id.includes('@')) {
        user = await result.find({email: req.body.id}).toArray();
    } else {
        user = await result.find({id: req.body.id}).toArray();
    }
    user = user[0]
    if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, res) {
            if (res) {
                const token = jwt.sign({
                        id: user._id
                    },
                    process.env.SALT, {
                        expiresIn: '7d'
                    }
                );

                user.password = undefined;

                response.status(200).send({
                    token: token,
                    user: user
                });
            } else {
                response.status(401).send();
            }
        });
    } else {
        res.statusMessage = 'Authentication failed'
        res.status(401).send();
    }
});

router.get('/', async (req, res) => {
    if (req.query.id !== undefined && req.query.id.length < 16) {
        let response = await result
            .find({id: req.query.id})
            .project({email: false})
            .limit(100).toArray()
        response.password = undefined;
        response._id = undefined;
        res.send(response);
    } else {
        let response = await result
            .find({_id: mongodb.ObjectId(req.query.id)})
            .project({email: false}).toArray()
        response.password = undefined;
        response._id = undefined;
        res.send(response);
    }
});

router.get('/resolveid/', async (req, res) => {
    let response = await result
        .find({_id: mongodb.ObjectId(req.query.id)})
        .project({id: true}).toArray()
    res.send(response);
});


router.get('/u/', async (req, res) => {
    if (req.query.id !== undefined) {
        let response = await result
            .find({id: req.query.id})
            .project({email: false}).toArray()
        response.password = undefined;
        response._id = undefined;
        res.send(response);
    }
});

function validateUsername(id) {
    let valid = true;
    let allowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.".split("");
    if (id.length < 4 || id.length > 16) {
        valid = false;
    }
    for (let i = 0; i < id.length; i++) {
        if (!allowedCharacters.includes(id.charAt(i))) {
            valid = false;
        }
    }
    return valid;
}

// function validateEmail(email) {
//     let valid = true;
//     let allowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.@".split("");
//     const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
//     valid = re.no(email);
//     if (email.length < 5 || email.length > 16) {
//         valid = false;
//     }
//     for (let i = 0; i < email.length; i++) {
//         if (!allowedCharacters.includes(email.charAt(i))) {
//             valid = false;
//         }
//     }
//     return valid;
// }

router.get('/validateUsername/', async (req, res) => {
    if (!validateUsername(req.query.id)) {
        res.send(false);
        return
    }
    if (req.query.id !== undefined) {
        res.send(await result
            .find({id: req.query.id}).count() === 0);
    }
});

router.get('/new/', async (req, res) => {
    res.send(await result.find({})
        .project({id: true, img: true, firstname: true, lastname: true, createdAt: true})
        .sort({createdAt: -1})
        .limit(12).toArray());
});

router.post('/id/', isLoggedIn, async (req, res) => {
    if (req.body.id !== 'test') {
        await result.findOneAndUpdate({
                _id: mongodb.ObjectId(req.body.id)
            },
            {
                $set: {
                    id: req.body.newid
                }
            });
        res.status(201).send();
    } else {
        res.status(401).send();
    }
});

router.post('/bio/', isLoggedIn, async (req, res) => {
    await result.findOneAndUpdate({
            _id: mongodb.ObjectId(req.body.id)
        },
        {
            $set: {
                bio: req.body.bio
            }
        });
    res.status(201).send();

});

router.post('/firstname/', isLoggedIn, async (req, res) => {
    if (req.body.id === 'test') return;
    await result.findOneAndUpdate({
            _id: mongodb.ObjectId(req.body.id)
        },
        {
            $set: {
                firstname: req.body.firstname,
            }
        });
    res.status(201).send();
});

router.post('/lastname/', isLoggedIn, async (req, res) => {
    if (req.body.id === 'test') return;
    await result.findOneAndUpdate({
            _id: mongodb.ObjectId(req.body.id)
        },
        {
            $set: {
                lastname: req.body.lastname
            }
        });
    res.status(201).send();
});

router.post('/keebs/', isLoggedIn, async (req, res) => {
    await result.findOneAndUpdate({
            _id: mongodb.ObjectId(req.body.id)
        },
        {
            $set: {
                keyboards: req.body.keebs
            }
        });
    res.status(201).send();
});

router.post('/delete', isLoggedIn, async (req, res) => {
    if (req.body.id === 'test') return;
    await result.deleteOne({id: req.body.id});
    res.status(200).send();
});

router.post('/recommend/', isLoggedIn, async (req, res) => {
    if (req.body.id)
        await result.findOneAndUpdate({
                id: req.body.user
            },
            {
                $push: {
                    recommendations: {
                        submitter: req.body.id,
                        reason: req.body.text
                    }
                }
            });
    res.status(201).send();

});

router.post('/report/', isLoggedIn, async (req, res) => {
    await result.findOneAndUpdate({
            id: req.body.user
        },
        {
            $push: {
                reports: {
                    submitter: req.body.id,
                    reason: req.body.text
                }
            }
        });
    res.status(201).send();
});

router.get('/search/',  async (req, res) => {
    if(!req.query.text) return;
    if(req.query.text === '') return;
    let response = await result.find({
            $text : {
                $search : req.query.text
            }
        }).project({email: false, password: false})
        .limit(100).toArray()
    res.send(response);
});

async function connect() {
    const client = await mongodb.MongoClient.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    return client.db(process.env.DB_NAME).collection('users');
}

function isLoggedIn(req, res, next) {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.SALT
        );
        req.tokenData = decoded;
        console.log(req.tokenData.id)
        if (req.tokenData.id === req.body.id || req.tokenData.id === req.query.id) {
            next();
        } else {
            res.status(401).send({
                message: 'Authentication failed'
            });
        }
    } catch (err) {
        return res.status(401).send({
            message: 'Authentication failed'
        });
    }
}

module.exports = router;