require('dotenv').config()

const fs = require('fs');
const util = require('util');
const express = require('express');
const app = express();
const dateformat = require('dateformat')
const log_file = fs.createWriteStream(`../logs/${dateformat(new Date(), "dd-mm-yyyy-hh-MM-ss")}.log`, {flags : 'w'});
const log_stdout = process.stdout;

const cors = require('cors');
const https = require('https');
const generateSitemap = require('./generateSitemap')

const guard = require('./middleware/guard')
const logger = require('./middleware/logger')

app.use(guard)
app.use(logger)
app.use(express.json());
app.use(cors());

console.log = function(who, text) {
    if(!text) text = who
    log_file.write("LOG ["+dateformat(new Date(), "isoDateTime")+ "]" + " ["+who+"] " + util.format(text) + '\n');
    log_stdout.write("LOG ["+dateformat(new Date(), "isoDateTime")+ "]" + " ["+who+"] " + util.format(text) + '\n');
};

console.error = function(who, text) {
    if(!text) text = who
    log_file.write("ERROR ["+dateformat(new Date(), "isoDateTime")+ "] " + " ["+who+"] "  + util.format(text) + '\n');
    log_stdout.write("ERROR ["+dateformat(new Date(), "isoDateTime")+ "]" + " ["+who+"] " + util.format(text) + '\n');
};

console.log('start', 'PORT: ' + process.env.PORT)
console.log('start','DB_USERNAME: ' + process.env.DB_USERNAME)
console.log('start','DB_PASSWORD: ' + process.env.DB_PASSWORD.length + " characters")
console.log('start','DB_CONNECT_URL: ' + process.env.DB_CONNECT_URL)

const users = require('./api/users');
const img = require('./api/img');
const announcements = require('./api/announcements');
const keyboards = require('./api/keyboards');
const listings = require('./api/listings');
const posts = require('./api/posts');
const messages = require('./api/messages');
const stats = require('./api/stats');
const kbapi = require('./api/kbapi');

app.use('/api/stats', stats);
app.use('/api/users', users);
app.use('/api/img', img);
app.use('/api/announcements', announcements);
app.use('/api/listings', listings);
app.use('/api/posts', posts);
app.use('/api/messages', messages);
app.use('/api/keyboards', keyboards);
app.use('/api/kbapi', kbapi);

app.use(express.static('public'));
app.use(express.static('images'));

generateSitemap((app))
setInterval(function (){
    generateSitemap(app)
}, 1000 * 60 * 60)

app.use('/sitemap', express.static('public/sitemap.xml'))
app.use('/files', express.static('files'))

var privateKey = fs.readFileSync('certs/click-clack_cc.key');
var certificate = fs.readFileSync('certs/click-clack_cc.crt');
var ca = fs.readFileSync('certs/click-clack_cc.ca-bundle');

https.createServer({
    key: privateKey,
    ca: ca,
    cert: certificate
}, app).listen(process.env.PORT, () => console.log(`server started at ${process.env.HOST}:${process.env.PORT}`));






