// These "requires" is needed by mattermost-redux
require('babel-polyfill');
require('isomorphic-fetch');
const MattermostClient4 = require('mattermost-redux/client/client4.js');

const fs = require('fs');
const util = require('util');
const FormData = require('form-data');
const webshot = require('./webshot');


module.exports = class Mattermost {
    constructor (url, token) {
        this.client = new MattermostClient4.default(); // eslint-disable-line new-cap
        this.client.setUrl(url);
        this.client.setToken(token);

        // redash query URL specified as argument of slash commands.
        // This URL follows `http(s)://${redash_host}/queries/${query_id}/source#${visualization_id}`
        this.re = /(http[s]?):\/\/([^\/]+)\/queries\/([0-9]+)\/source#([0-9]+)/g; // eslint-disable-line no-useless-escape
    }
    async uploadFile(channel_id, text, redashApiKey){
        const embedUrl = this.parseURL(text, redashApiKey);
        console.log('Redash Embed URL: %s', embedUrl); // eslint-disable-line no-console
        const file = await webshot(embedUrl);

        // Upload webshot image file
        const imageFormData = new FormData();
        imageFormData.append('files', fs.createReadStream(file));
        imageFormData.append('channel_id', channel_id);

        return await this.client.uploadFile(imageFormData, imageFormData.getBoundary());
    }
    async getFilePublicLink(channel_id, file_id){
        // Get public link of uploaded file
        const post = await this.client.createPost({
            channel_id: channel_id,
            message: 'This message is posted solely to get the public link and should be deleted immediately.',
            file_ids: [file_id]
        });
        const link = await this.client.getFilePublicLink(file_id);
        console.log('Public Link URL: %s', link.link); // eslint-disable-line no-console
        return { post_id: post.id, public_link: link.link};
    }
    async deletePost(post_id) {
        this.client.deletePost(post_id);
    }
    parseURL(url, apiKey) {
        const array = this.re.exec(url);
        if (!array) {
            throw new Error('Arguments is invalid. Please specify redash query URL of the following form. `http(s)://{redash_host}/queries/{query_id}/source#{visualization_id}`');
        }

        // Take a webshot of redash
        const protocol = array[1];
        const redashHost = array[2];
        const queryId = array[3];
        const visualizationId = array[4];

        return util.format('%s://%s/embed/query/%d/visualization/%d?api_key=%s', protocol, redashHost, queryId, visualizationId, apiKey);
    }
    async makeCommandResponse(query, fileLink) {
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
    async makeErrorResponse(err) {
        return {
            response_type: 'ephemeral',
            text: "Matter-Redash Error: " + err
        }
    }
}
