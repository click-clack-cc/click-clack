import fs from 'fs'
import redirectSSL from 'redirect-ssl'

export default {
    mode: 'universal',
    server: {
        port: 443,
        host: '192.168.0.106',
        https: {
            key: fs.readFileSync('certs/click-clack_cc.key'),
            ca: fs.readFileSync('certs/ccbundle.crt'),
            cert: fs.readFileSync('certs/cc.crt')
        }
    },
    loading: false,
    head: {
        title: 'click-clack',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'og:title', property: 'og:title', hid: 'og:title', content: 'click-clack' },
            {
                name: 'description',
                property: 'description',
                hid: 'description',
                content: 'Join click-clack, upload your custom mechanical keyboard builds and test your typing speed! On click-clack you can share photos of your keebs and keep track of your typing test statistics.'
            },
            {
                name: 'og:description',
                property: 'og:description',
                hid: 'og:description',
                content: 'Join click-clack, upload your custom mechanical keyboard builds and test your typing speed! On click-clack you can share photos of your keebs and keep track of your typing test statistics.'
            },
            {
                name: 'og:image',
                hid: 'og:image',
                property: 'og:image',
                content: 'https://click-clack.cc:5000/files/images/indeximage.JPG'
            },
            {
                name: 'image',
                hid: 'image',
                property: 'image',
                content: 'https://click-clack.cc:5000/files/images/indeximage.JPG'
            },
            { name: 'og:site_name', property: 'og:site_name', hid: 'og:site_name', content: 'click-clack' },
            { name: 'og:type', property: 'og:type', hid: 'og:type', content: 'website' },
            { name: 'og:url', property: 'og:url', hid: 'og:url', content: 'https://click-clack.cc' },
            { name: 'twitter:title', property: 'twitter:title', hid: 'twitter:title', content: 'click-clack' },
            {
                name: 'twitter:description',
                property: 'twitter:description',
                hid: 'twitter:description',
                content: 'Join click-clack, upload your custom mechanical keyboard builds and test your typing speed! On click-clack you can share photos of your keebs and keep track of your typing test statistics.'
            },
            {
                name: 'twitter:image',
                hid: 'twitter:image',
                property: 'twitter:image',
                content: 'https://click-clack.cc:5000/files/images/indeximage.JPG'
            }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    serverMiddleware: [
        redirectSSL.create({
            statusCode: 301
        })
    ],
    buildModules: [
        // '@nuxtjs/eslint-module',
        '@nuxtjs/dotenv'
    ],
    modules: [
        'cookie-universal-nuxt',
        'bootstrap-vue/nuxt'
    ]
}
