# urlshorten
A simple url shorten server, support HTTP method: `GET` and `POST`

## Install
Install and run MongoDB(https://www.mongodb.org/) first, then
```bash
$ npm install
```

## Run
```bash
$ NODE_ENV=production node app.js
```

## Examples
`POST`:
```bash
$ curl -d "url=http://yige.info/" http://yige.info/; echo
{"code":200,"short":"yige.info/x21g1l13"}

$ curl -d "url=http://google.com/" http://yige.info/; echo
{"code":200,"short":"yige.info/qzfr1fr2"}
```

`GET`:
```bash
$ curl yige.info/x21g1l13; echo
{"code":200,"url":"http://yige.info/"}

$ curl yige.info/qzfr1fr2; echo
{"code":200,"url":"http://google.com/"}
```
