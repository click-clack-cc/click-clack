require('dotenv').config()
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
require('console-stamp')(console, '[HH:MM:ss.l]');
var path = require('path');
const mongodb = require('mongodb');

const app = express();

app.use(express.json());
app.use(cors());

console.log('PORT: ' + process.env.PORT)
console.log('DB_USERNAME: ' + process.env.DB_USERNAME)
console.log('DB_PASSWORD: ' + process.env.DB_PASSWORD.length + " characters")
console.log('DB_CONNECT_URL: ' + process.env.DB_CONNECT_URL)

const uri = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL}`;

const users = require('./api/users');
const img = require('./api/img');
const announcements = require('./api/announcements');
const keyboards = require('./api/keyboards');
const listings = require('./api/listings');
const posts = require('./api/posts');
const messages = require('./api/messages');
const stats = require('./api/stats');

app.use('/api/stats', stats);
app.use('/api/users', users);
app.use('/api/img', img);
app.use('/api/announcements', announcements);
app.use('/api/listings', listings);
app.use('/api/posts', posts);
app.use('/api/messages', messages);
app.use('/api/keyboards', keyboards);

const port = process.env.PORT;

app.use(express.static('public'));
app.use(express.static('images'));

async function generateSitemap() {
    var sitemap = require('express-sitemap');
    let map = {
        '/': ['get'],
        '/showroom': ['get'],
        '/community': ['get'],
    }
    let route = {
        '/': {
            lastmod: '2020-06-16',
            changefreq: 'always',
            priority: 1.0,
        },
        '/market': {
            lastmod: '2020-06-16',
            changefreq: 'daily',
            priority: 1.0,
        },
        '/typing': {
            lastmod: '2020-06-16',
            changefreq: 'weekly',
            priority: 0.3,
        },
        '/showroom': {
            lastmod: '2020-06-16',
            changefreq: 'daily',
            priority: 0.5,
        },
        '/termsandconditions': {
            lastmod: '2020-06-16',
            changefreq: 'weekly',
            priority: 0.2,
        },
        '/markdown': {
            lastmod: '2020-06-16',
            changefreq: 'weekly',
            priority: 0.2,
        },
        '/bugreport': {
            lastmod: '2020-06-16',
            changefreq: 'weekly',
            priority: 0.2,
        }
    }

    mongodb.MongoClient.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(async (connection) => {
        let users = await connection.db(process.env.DB_NAME).collection('users').find({}).project({
            id: true,
            _id: false
        }).toArray();
        for (let i = 0; i < users.length; i++) {
            map['/u/' + users[i].id] = ['get'];
            route['/u/' + users[i].id] = {
                // lastmod: '2020-06-09',
                changefreq: 'daily'
            }
        }
        mongodb.MongoClient.connect(uri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(async (connection) => {
            let keyboards = await connection.db(process.env.DB_NAME).collection('keyboards').find({}).project({_id: true}).toArray();
            for (let i = 0; i < keyboards.length; i++) {
                map['/keyboard/' + keyboards[i]._id] = ['get'];
                route['/keyboard/' + keyboards[i]._id] = {
                    // lastmod: '2020-06-09',
                    changefreq: 'weekly'
                }
            }

            mongodb.MongoClient.connect(uri,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }).then(async (connection) => {
                let listings = await connection.db(process.env.DB_NAME).collection('listings').find({}).project({_id: true}).toArray();
                for (let i = 0; i < listings.length; i++) {
                    map['/listing/' + listings[i]._id] = ['get'];
                    route['/listing/' + listings[i]._id] = {
                        // lastmod: '2020-06-09',
                        changefreq: 'weekly'
                    }
                }

                mongodb.MongoClient.connect(uri,
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    }).then(async (connection) => {
                    let listings = await connection.db(process.env.DB_NAME).collection('posts').find({}).project({_id: true}).toArray();
                    for (let i = 0; i < listings.length; i++) {
                        map['/post/' + listings[i]._id] = ['get'];
                        route['/post/' + listings[i]._id] = {
                            // lastmod: '2020-06-09',
                            changefreq: 'weekly'
                        }
                    }

                    await sitemap({
                        http: 'https',
                        url: 'click-clack.cc',
                        sitemap: 'public/sitemap.xml',
                        robots: 'public/robots.txt',
                        generate: app,
                        sitemapSubmission: '/sitemap.xml',
                        map: map,
                        route: route
                    }).toFile();
                    console.log('sitemap generated')
                })
            })
        })
    })
}

generateSitemap()
setInterval(generateSitemap, 1000 * 60 * 60)

// Virtual Path Prefix '/static'
app.use('/sitemap', express.static('public/sitemap.xml'))

// Virtual Path Prefix '/static'
app.use('/files', express.static('files'))

// app.use(bodyParser.urlencoded({ extended: true }));

var privateKey = fs.readFileSync('certs/click-clack_cc.key');
var certificate = fs.readFileSync('certs/click-clack_cc.crt');
var ca = fs.readFileSync('certs/click-clack_cc.ca-bundle');

// var http = express.createServer();
//
// http.get('*', function(req, res) {
//     res.redirect('https://' + req.headers.host + req.url);
// })
//
// http.listen(8080);

https.createServer({
    key: privateKey,
    ca: ca,
    cert: certificate
}, app).listen(port, () => console.log(`server started on port ${port}`));






