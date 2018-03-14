'use strict';

const express = require('express');
var util = require('util');
var url = require('url');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
// Constants
const PORT = 28080;
const HOST = '0.0.0.0';

function getItemsJson(items) {
    var itemsJson = []
    for (var i=0; i<items.length; i++) {
        var item = items[i];
        itemsJson.push(`{"anchor":"","label":"","ProModel":"${item}","summary":"","tag":"","thumbnail":"","title":"${item}"}`);
    }
    var itemString = itemsJson.join(',');
    var json = JSON.parse(`{"code":"000000", "list":[${itemString}]}`);
    return json
}

this.log = console.log.bind( console, new Date().toLocaleString() + ":" );

// App
const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data

app.get('/', (req, res) => {
    res.send('Hello world, Michael\n');
});

app.get('/fault/ProModel', (req, res) => {
    this.log(req.query.name);
    this.log(req.query.tel);
    var params = url.parse(req.url, true).query;
    this.log(params.name, params.url, params);
    //res.send('you are visiting '+ params +'\n');
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end(util.inspect(url.parse(req.url, true)));
});

app.post('/ProModel', (req, res) => {
    this.log(req.headers['content-type']);
    this.log(util.inspect(url.parse(req.url, true)));
    this.log(req.body);

    var items = ['HP Deskjet', 'HP Officejet', 'HP Laserjet', 'HP PageWide'];
    var json = getItemsJson(items)
    res.json(json)

});

app.listen(PORT, HOST);
this.log(`Running on http://${HOST}:${PORT}`);