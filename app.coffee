EventEmmitter = (require "events").EventEmmitter
express = require "express"
mongoose = require('mongoose')
bodyParser = require('body-parser')
validate = require "./validate"
uniqueId = require "./unique_id"

mongoose.connect('mongodb://localhost/urlshorten')

app = express()
app.use(bodyParser.urlencoded({ extended: true }))

URLSchema = mongoose.Schema
    id: String
    url: String

URLSchema.index
    id: 1
    url: 1
    unique: true

URL = mongoose.model('URL', URLSchema)

app.get "/", (req, res) ->
    res.json
        code: 200
        url: "/"

app.get "/:id", (req, res) ->
    id = req.params.id
    URL.findOne { id: id }, (err, url) ->
        if err
            res.status(500)
        else
            if url?
                ret =
                    code: 200
                    url: url.url
            else
                ret =
                    code: 404
                    info: "not found"
        res.json ret

app.post "/", (req, res) ->
    url = req.body.url
    unless url?
        res.json
            code: 400
            info: "Bad request"
    else
        if validate url
            domain = req.header("Host")
            URL.findOne { url: url }, (err, result) ->
                if err
                    console.error err
                    res.status(500)
                else
                    if result?
                        res.json
                            code: 200
                            short: domain + "/" + result.id
                    else
                        generateShortURL = ->
                            id = uniqueId()
                            URL.findOne { id: id }, (err, result) ->
                                if err
                                    console.log err
                                unless result?
                                    url_ = new URL({ id: id, url: url })
                                    url_.save (err, url_) ->
                                        if err
                                            console.error err
                                            res.status(500)
                                        else
                                            res.json
                                                code: 200
                                                short: domain + "/" + url_.id
                                    clearInterval(interval)
                        interval = setInterval(generateShortURL, 0)

        else
            res.json
                code: 400
                info: "Invalid url"

app.listen 3000, "127.0.0.1"