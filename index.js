const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

const Mattermost = require('./app/mattermost');

process.on('unhandledRejection', console.dir);

const pong = (req, res) => {
    res.send('pong');
};

const server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.get('/ping', pong);
server.post('/redash', async (req, res) => {
    const mm = new Mattermost(config.mattermost.host, config.mattermost.apiToken);
    let resp, post_id;
    try {
        const file = await mm.uploadFile(req.body.channel_id, req.body.text, config.redash.apiKey);
        const link = await mm.getFilePublicLink(req.body.channel_id, file.file_infos[0].id);
        post_id = link.post_id;
        resp = await mm.makeCommandResponse(req.body.text, link.public_link);
    } catch (err) {
        resp = await mm.makeErrorResponse(err);
    }
    res.header({'content-type': 'application/json'});
    res.send(resp);

    if (post_id) {
        mm.deletePost(post_id);
    }
});

server.listen(8888, (err) => {
    if (err) {
        console.error(err); // eslint-disable-line no-console
    } else {
        console.log('%s listening', server.name); // eslint-disable-line no-console
    }
});