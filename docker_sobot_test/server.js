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

function getItemsJson(items, paramName) {
    var itemsJson = []
    for (var i=0; i<items.length; i++) {
        var item = items[i];
        itemsJson.push(`{"anchor":"","label":"","${paramName}":"${item}","summary":"","tag":"","thumbnail":"","title":"${item}"}`);
    }
    var itemString = itemsJson.join(',');
    var json = JSON.parse(`{"code":"000000", "list":[${itemString}]}`);
    return json
}

function log(text) {
    console.log(new Date().toLocaleString() + ":" , text );
}

// App
const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data

app.get('/', (req, res) => {
    res.send('Hello world, Michael\n');
});

app.get('/fault/ProModel', (req, res) => {
    log(req.query.name);
    log(req.query.tel);
    var params = url.parse(req.url, true).query;
    log(params.name, params.url, params);
    //res.send('you are visiting '+ params +'\n');
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end(util.inspect(url.parse(req.url, true)));
});

app.post('/ProModel', (req, res) => {
    log(req.headers['content-type']);
    log(util.inspect(url.parse(req.url, true)));
    log(req.body);

    var items = ['HP Deskjet', 'HP Officejet', 'HP Laserjet', 'HP PageWide'];
    var json = getItemsJson(items, 'ProModel')
    res.json(json)

});

app.post('/ProName', (req, res) => {
    log(req.headers['content-type']);
    log(util.inspect(url.parse(req.url, true)));
    log(req.body);

    var proModel = req.body.ProModel.replace(" ", "_")
    var proName = req.body.ProName

    // var proModels = {
    var HP_Deskjet = ['F378', 'F388', 'F212', 'F218', 'F223', 'F228', 'F241', 'F248', 'F735', 'F423', 'F428',
            'F448', 'K209', '1050', '2050', '2060', '4615', '4625'];
    var HP_Officejet = ['725', 'V40', '4110', '4255', '4256', '4308', '4338', '4500', '4500', '5110', '5510',
        '5608', '5609', '5679', '6110', '6208', '6318', '7208', '6500', '6500', '6500', '6500', '7500'];
    var HP_Laserjet = ['3050', '3050z', '3052', '3055', '3390', 'M1005', 'M3027', 'M3035', 'M4345', 'M5025',
        'M5035', '1018', '1020', '1022', '1160', '1320', '3050', '3050z', '3052', '3055', '3390', 'M1005',
        'M3027', 'M5025', 'P2015', 'P3005', '3050', '3050z', '3052', '3055', '3390', 'M1005', 'M5025'];
    var HP_PageWide = ['P75050DN', 'P77740DW', 'P77760Z', 'P77750Z', 'P77740Z', 'P77740DN', 'P75050DW', '7772DN',
        '750DW', '777Z', '750DN', '772DW'];

    function hasProName(item) {
        return item.indexOf(proName)>=0;
    }

    switch (proModel)
    {
        case 'HP_Deskjet':
            var items = HP_Deskjet.filter(hasProName);
            break;
        case 'HP_Officejet':
            var items = HP_Officejet.filter(hasProName);
            break;
        case 'HP_Laserjet':
            var items = HP_Laserjet.filter(hasProName);
            break;
        case 'HP_PageWide':
            var items = HP_PageWide.filter(hasProName);
            break;
        default:
            var items = [];
    }
    var json = getItemsJson(items, 'ProName');
    log(json)
    res.json(json);
});

app.listen(PORT, HOST);
log(`Running on http://${HOST}:${PORT}`);