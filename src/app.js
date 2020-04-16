require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()

let morganOption = "";
if (NODE_ENV === "development") {
    morganOption = "dev"
}
else {
    //These logging defaults assume you are using a seperate front end app to connect to the API.
    //If you are hosting a public API, it is highly reccomended you adjust these to more applicable values. https://www.npmjs.com/package/morgan#tokens
    morganOption = ":date[web] - :method :url :status - :total-time[3] ms"
}

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

// If you want to use HTTPS instead when deploying to Heroku, uncomment these lines. Make sure your have ACM or Manual Certificates setup
/*
if (NODE_ENV === "production") {
    const sslRedirect = require('heroku-ssl-redirect')
    app.use(sslRedirect())
}
*/

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

module.exports = app