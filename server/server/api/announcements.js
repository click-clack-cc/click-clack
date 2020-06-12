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
    console.log('announcements.js connected to test.announcements')
})

router.get('/', async (req, res) => {
    let response = await result
        .find()
        .sort({createdAt: -1})
        .limit(5).toArray()
    res.send(response);
})

router.post('/', async (req, res) => {
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
    return client.db('test').collection('announcements');
}

module.exports = router;