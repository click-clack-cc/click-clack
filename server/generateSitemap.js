const mongodb = require('mongodb');
const uri = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECT_URL}`;
const express = require('express');

module.exports = async function generateSitemap(app) {
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

    let mapTargets = [{
        collection: 'users',
        id: 'id',
        map: 'u'
    }, {
        collection: 'keyboards',
        id: '_id',
        map: 'keyboard'
    }, {
        collection: 'posts',
        id: '_id',
        map: 'post'
    }, {
        collection: 'listings',
        id: '_id',
        map: 'listing'
    }]

    for (let i = 0; i < mapTargets.length; i++) {
        let connection = await mongodb.MongoClient.connect(uri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })

        let items = await connection.db(process.env.DB_NAME).collection(mapTargets[i].collection).find({}).project({
            id: true,
            _id: true
        }).toArray();

        for (let j= 0; j < items.length; j++) {
            map[`/${mapTargets[i].map}/` + items[j][mapTargets[i].id]] = ['get'];
            route[`/${mapTargets[i].map}/` + items[j][mapTargets[i].id]] = {
                changefreq: 'daily'
            }
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
}