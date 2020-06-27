
# click-clack

Welcome to the private repository of click-clack.cc. Please enjoy your stay.

## Build Setup

**client**
```
# install dependencies
npm install

# create a .env file inside the client directory as follows:
NODE_ENV = 'debug'
PORT = 443
# PORT = 8080 if using http mode
HOST = localhost
API_URL = 'https://click-clack.cc:5000/api' 
# this url connects to production db
GOOGLE_ANALYTICS_ID = 'xxxx'
HTTPS_KEY = ''
HTTPS_CA = ''
HTTPS_CERT = ''

# serve in dev mode with hot reload
npm run dev
```
If you are running in http mode, you also have to remove the following lines in `nuxt.config.js`:
```
https: {
    key: process.env.HTTPS_KEY ? fs.readFileSync(`${process.env.HTTPS_KEY}`) : null,
    ca: process.env.HTTPS_CA ? fs.readFileSync(`${process.env.HTTPS_CA}`) : null,
    cert: process.env.HTTPS_CERT ? fs.readFileSync(`${process.env.HTTPS_CERT}`) : null
}
```
```
serverMiddleware: [
	redirectSSL.create({
		statusCode: 301
	})
],
```
*The content of nuxt.config.js is subject to changes and the above snippets may be affected. In this case please contact a member of the dev team to update the build instructions.*

**server**

Instructions to be updated.