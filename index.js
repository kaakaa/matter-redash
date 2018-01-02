const express = require('express');
const bodyParser = require('body-parser');
const redashCommand = require('./app/mattermost');

const pong = (req, res) => {
    res.send('pong');
};

const server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.get('/ping', pong);
server.post('/redash', redashCommand);

server.listen(8888, (err) => {
    if (err) {
        console.error(err); // eslint-disable-line no-console
    } else {
        console.log('%s listening', server.name,); // eslint-disable-line no-console
    }
});