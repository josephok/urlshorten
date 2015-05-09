(function() {
  var EventEmmitter, URL, URLSchema, app, bodyParser, express, mongoose, uniqueId, validate;

  EventEmmitter = (require("events")).EventEmmitter;

  express = require("express");

  mongoose = require('mongoose');

  bodyParser = require('body-parser');

  validate = require("./validate");

  uniqueId = require("./unique_id");

  mongoose.connect('mongodb://localhost/urlshorten');

  app = express();

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  URLSchema = mongoose.Schema({
    id: String,
    url: String
  });

  URLSchema.index({
    id: 1,
    url: 1,
    unique: true
  });

  URL = mongoose.model('URL', URLSchema);

  app.get("/", function(req, res) {
    return res.json({
      code: 200,
      url: "/"
    });
  });

  app.get("/:id", function(req, res) {
    var id;
    id = req.params.id;
    return URL.findOne({
      id: id
    }, function(err, url) {
      var ret;
      if (err) {
        res.status(500);
      } else {
        if (url != null) {
          ret = {
            code: 200,
            url: url.url
          };
        } else {
          ret = {
            code: 404,
            info: "not found"
          };
        }
      }
      return res.json(ret);
    });
  });

  app.post("/", function(req, res) {
    var domain, url;
    url = req.body.url;
    if (url == null) {
      return res.json({
        code: 400,
        info: "Bad request"
      });
    } else {
      if (validate(url)) {
        domain = req.header("Host");
        return URL.findOne({
          url: url
        }, function(err, result) {
          var generateShortURL, interval;
          if (err) {
            console.error(err);
            return res.status(500);
          } else {
            if (result != null) {
              return res.json({
                code: 200,
                short: domain + "/" + result.id
              });
            } else {
              generateShortURL = function() {
                var id;
                id = uniqueId();
                return URL.findOne({
                  id: id
                }, function(err, result) {
                  var url_;
                  if (err) {
                    console.log(err);
                  }
                  if (result == null) {
                    url_ = new URL({
                      id: id,
                      url: url
                    });
                    url_.save(function(err, url_) {
                      if (err) {
                        console.error(err);
                        return res.status(500);
                      } else {
                        return res.json({
                          code: 200,
                          short: domain + "/" + url_.id
                        });
                      }
                    });
                    return clearInterval(interval);
                  }
                });
              };
              return interval = setInterval(generateShortURL, 0);
            }
          }
        });
      } else {
        return res.json({
          code: 400,
          info: "Invalid url"
        });
      }
    }
  });

  app.listen(3000, "127.0.0.1");

}).call(this);
