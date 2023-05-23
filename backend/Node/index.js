const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const serverlessExpress = require('@vendia/serverless-express')
const MoviesRouter = require('./routes/Movies.js')

const app = express()

app.use(express.json())

app.use(bodyParser.urlencoded(
{
    extended: true
}))

app.use(cors())

app.use('/', MoviesRouter)

module.exports.handler = serverlessExpress({app})