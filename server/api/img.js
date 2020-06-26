const express = require('express');
const multer = require('multer');
const {Resize, ProfilePicResize} = require('./Resize');
let isLoggedIn = require('../middleware/auth')

const upload = multer({
    limits: {
        fileSize: 4 * 8000 * 8000,
    }
});

const router = express.Router();

router.post('/upload', isLoggedIn, upload.single('image'), async function (req, res) {
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

router.post('/keebphotos', isLoggedIn, upload.array('image'), async function (req, res) {
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

router.post('/listingphotos', isLoggedIn,  upload.array('image'), async function (req, res) {
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

router.post('/postphotos', isLoggedIn, upload.array('image'), async function (req, res) {
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

module.exports = router;