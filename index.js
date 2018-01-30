// These 'requires' is needed by mattermost-redux
require('babel-polyfill');
require('isomorphic-fetch');
const MattermostClient4 = require('mattermost-redux/client/client4.js');

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

const Mattermost = require('./app/mattermost');
const webshot = require('./app/webshot');

process.on('unhandledRejection', console.dir); // eslint-disable-line no-console

const pong = (req, res) => {
    res.send('pong');
};

const server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.get('/ping', pong);
server.post('/redash', async (req, res) => {
    const mm = new Mattermost(new MattermostClient4.default(), config.mattermost.host, config.mattermost.apiToken);
    let resp;
    let postId;
    try {
        const file = await mm.uploadFile(req.body.channel_id, req.body.text, config.redash.apiKey, webshot);
        const link = await mm.getFilePublicLink(req.body.channel_id, file.file_infos[0].id);
        postId = link.post_id;
        resp = await mm.makeCommandResponse(req.body.text, link.public_link);
    } catch (err) {
        resp = await mm.makeErrorResponse(err);
    }
    res.header({'content-type': 'application/json'});
    res.send(resp);

    if (postId) {
        mm.deletePost(postId);
    }
});

server.listen(8888, (err) => {
    if (err) {
        console.error(err); // eslint-disable-line no-console
    } else {
        console.log('%s listening', server.name); // eslint-disable-line no-console
    }
});
