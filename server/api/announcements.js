require('dotenv').config()
const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
let isAdmin = require('../middleware/admin')

const uri = `${process.env.DB_CONNECT_URL_PREFIX}${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL_POSTFIX}`;

let result = null;
connect().then((db) => {
    result = db;
    console.log('announcements.js connected to ' + process.env.DB_NAME + '.announcements')
}).catch((err) => {
    console.error('announcements.js could not connect to ' + process.env.DB_NAME + '.announcements: ' + err)
})

router.get('/', async (req, res) => {
    let response = await result
        .find()
        .sort({createdAt: -1})
        .limit(5).toArray()
    res.send(response);
})

router.post('/', isAdmin, async (req, res) => {
    await result.insertOne({
        text: req.body.text,
        createdAt: new Date()
    }).then(() => {
        res.status(201).send();
    });
})

async function connect() {
    const client = await mongodb.MongoClient.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    return client.db(process.env.DB_NAME).collection('announcements');
}

module.exports = router;