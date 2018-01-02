// These "requires" is needed by mattermost-redux
require('babel-polyfill');
require('isomorphic-fetch');
const MattermostClient4 = require('mattermost-redux/client/client4.js');

const fs = require('fs');
const util = require('util');
const FormData = require('form-data');
const config = require('config');
const webshot = require('./webshot');

// redash query URL specified as argument of slash commands.
// This URL follows `http(s)://${redash_host}/queries/${query_id}/source#${visualization_id}`
const re = /(http[s]?):\/\/([^\/]+)\/queries\/([0-9]+)\/source#([0-9]+)/g; // eslint-disable-line no-useless-escape

const client = new MattermostClient4.default(); // eslint-disable-line new-cap
client.setUrl(config.mattermost.host);
client.setToken(config.mattermost.apiToken);

const redashCommand = async (req, res) => {
    // Parse arguments
    const url = req.body.text;
    const array = re.exec(url);
    if (!array) {
        res.send('Arguments is invalid. Please specify redash query URL of the following form. `http(s)://{redash_host}/queries/{query_id}/source#{visualization_id}`');
        return;
    }

    // Take a webshot of redash
    const protocol = array[1];
    const redashHost = array[2];
    const queryId = array[3];
    const visualizationId = array[4];

    const embedUrl = util.format('%s://%s/embed/query/%d/visualization/%d?api_key=%s', protocol, redashHost, queryId, visualizationId, config.redash.apiKey);
    console.log('Redash Embed URL: %s', embedUrl); // eslint-disable-line no-console
    const file = await webshot(embedUrl);

    // Upload webshot image file
    const imageFormData = new FormData();
    imageFormData.append('files', fs.createReadStream(file));
    imageFormData.append('channel_id', req.body.channel_id);

    const uploadFile = await client.uploadFile(imageFormData, imageFormData.getBoundary());

    // Get public link of uploaded file
    const fileId = uploadFile.file_infos[0].id;
    const post = await client.createPost({
        channel_id: req.body.channel_id,
        message: 'This message is posted solely to get the public link and should be deleted immediately.',
        file_ids: [fileId]
    });
    const link = await client.getFilePublicLink(fileId);
    console.log('Mattermost Public Link: %s', link.link); // eslint-disable-line no-console

    // Response to Mattermost
    res.header({'content-type': 'application/json'});
    res.send(commandResponse(url, link.link));

    // Delete unnecessary post.
    client.deletePost(post.id);
};

const commandResponse = (query, fileLink) => {
    return {
        response_type: 'in_channel',
        attachments: [
            {
                color: '#88ff00',
                pretext: '## Matter-Redash',
                text: util.format('**This image file can be downloaded from [here](%s). #matter-redash\n**Original Url is %s', fileLink, query),
                image_url: fileLink
            }
        ]
    };
};

module.exports = redashCommand;