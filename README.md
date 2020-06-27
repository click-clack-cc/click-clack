
# click-clack

Welcome to the private repository of click-clack.cc. Please enjoy your stay.

# Contribution

If you can read this, that means you have already spoken to @szabodanika and know what's up, but here you can read a bit more about our rules of contribution.

## How to contribute

0. Speak to @szabodanika about the feature/issue you would like to work on
If your project does not belong to an issue on the issue board, make sure you create an issue and assign it to yourself. Please include detailed description about what you plan to do and keep the issue updated, then solve the issue in your pull request. (e.g. solves #13)
1. Create a personal fork of click-clack
2. Implement your changes in your fork
3. Test your changes locally and ensure that the code satisfies the eslint rules
If your changes affect CRUD functionality or API services, please speak to @szabodanika about testing, because setting up a test environment or creating a database backup might be required.
4. Submit a pull request to the master branch and ping @szabodanika (email, discord or github)
5. Your pull request will be reviewed and merged unless there's an issue with it
6. Thank you for your contribution!

# Setting up your local instance

## Client

### 1. Install dependencies
```
npm install
```

### 2. Create a .env file inside the client directory as follows:
```
NODE_ENV = 'debug'
PORT = 443
GOOGLE_ANALYTICS_ID = ''
HTTPS_KEY = ''
HTTPS_CA = ''
HTTPS_CERT = ''
```
Use port 8080 to run in http mode instead of https
```
HOST = localhost
API_URL = 'https://click-clack.cc:5000/api' 
```
**This url will connect you to the production backend.**
While most requests are validated and we have backups,
please be careful when testing changes to services or CRUD functionality

### 3. Configure nuxt to run in http mode
Unless you have your own SSL certificates (you can generate your own using OpenSSL), you need to run click-clack in http mode.
To do this have to remove the following lines in `nuxt.config.js`:
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
### 4. Serve in dev mode with hot reload
```
npm run dev
```
*The content of nuxt.config.js is subject to changes and the above snippets may be affected. In this case please contact a member of the dev team to update the build instructions.*

## Server

Instructions to be updated.
