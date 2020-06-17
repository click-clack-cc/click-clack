const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {Resize, ProfilePicResize} = require('./Resize');

const upload = multer({
    limits: {
        fileSize: 4 * 8000 * 8000,
    }
});

const router = express.Router();

router.post('/upload', upload.single('image'), async function (req, res) {
    try {
        const fileUpload = new ProfilePicResize('files/images');
        if (!req.file) {
            res.statusText = 'Please provide an image'
            res.status(401);
        }
        await fileUpload.save(req.file.originalname, req.file.buffer);
        return res.status(200).send();
    } catch (e) {
        res.statusText = e
        res.status(401).send();
    }

});

router.post('/keebphotos', upload.array('image'), async function (req, res) {
    try {
        const fileUpload = new Resize('files/images');
        if (!req.files) {
            res.statusText = 'Please provide an image'
            res.status(401).send();
        }
        for (let i = 0; i < req.files.length; i++) {
            await fileUpload.save(req.files[i].originalname, req.files[i].buffer);
        }
        res.status(200).send();
    } catch (e) {
        res.statusText = e
        res.status(401).send();
    }
});

router.post('/listingphotos', upload.array('image'), async function (req, res) {
    try {
        const fileUpload = new Resize('files/images');
        if (!req.files) {
            res.statusText = 'Please provide an image'
            res.status(401).send();
        }
        for (let i = 0; i < req.files.length; i++) {
            await fileUpload.save(req.files[i].originalname, req.files[i].buffer);
        }
        res.status(200).send();
    } catch (e) {
        res.statusText = e
        res.status(401).send();
    }
});


function isLoggedIn(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
            token,
            'DC5C89929F8C5366540B8AFECA9CEB22C0095A54F3F45233A79246C666088CFD'
        );
        req.tokenData = decoded;
        if (req.tokenData.id === req.body.id || req.tokenData.id === req.query.id) {
            next();
        } else {
            res.statusText = 'Authentication failed'
            res.status(401).send();
        }
    } catch (err) {
        res.statusText = 'Authentication failed'
        return res.status(401).send();
    }
}

module.exports = router;