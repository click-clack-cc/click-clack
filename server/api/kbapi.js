require('dotenv').config()
const express = require('express');
const router = express.Router();

router.get('/switches', async (req, res) => {
    var request = require("request");
    var options = {method: 'GET', url: 'https://keyboardapi.me/switches'};
    request(options, function (error, response, body) {
        if(error) console.error("kbapi", error)
        res.json(body);
    });
})

router.get('/pcbs', async (req, res) => {
    var request = require("request");
    var options = {method: 'GET', url: 'https://keyboardapi.me/pcbs'};
    request(options, function (error, response, body) {
        if(error) console.error("kbapi", error)
        res.json(body);
    });
})

router.get('/plates', async (req, res) => {
    var request = require("request");
    var options = {method: 'GET', url: 'https://keyboardapi.me/plates'};
    request(options, function (error, response, body) {
        if(error) console.error("kbapi", error)
        res.json(body);
    });
})

router.get('/cases', async (req, res) => {
    var request = require("request");
    var options = {method: 'GET', url: 'https://keyboardapi.me/cases'};
    request(options, function (error, response, body) {
        if(error) console.error("kbapi", error)
        res.json(body);
    });
})

router.get('/keycaps', async (req, res) => {
    var request = require("request");
    var options = {method: 'GET', url: 'https://keyboardapi.me/keycaps'};
    request(options, function (error, response, body) {
        if(error) console.error("kbapi", error)
        res.json(body);
    });
})


module.exports = router;