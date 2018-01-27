/*global describe it: true*/
/*eslint max-nested-callbacks: ["error", 3]*/
/*eslint no-undef: 2*/
const assert = require('chai').assert; // eslint-disable-line node/no-unpublished-require

const Mattermost = require('../app/mattermost');

describe('testin parseURL', () => {
    it('input valid Redash visualizatoin url', () => {
        const mm = new Mattermost('localhost', 'test_token');
        const url = 'http://localhost:5000/queries/1/source#2';
        const apiKey = 'sample_api_key';
        const expected = 'http://localhost:5000/embed/query/1/visualization/2?api_key=sample_api_key';

        const actual = mm.parseURL(url, apiKey);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url with https', () => {
        const mm = new Mattermost('localhost', 'test_token');
        const url = 'https://localhost:5000/queries/1/source#4';
        const apiKey = 'sample_api_key';
        const expected = 'https://localhost:5000/embed/query/1/visualization/4?api_key=sample_api_key';

        const actual = mm.parseURL(url, apiKey);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url with ip_addr', () => {
        const mm = new Mattermost('localhost', 'test_token');
        const url = 'http://127.0.0.1:5000/queries/1/source#2';
        const apiKey = 'sample_api_key';
        const expected = 'http://127.0.0.1:5000/embed/query/1/visualization/2?api_key=sample_api_key';

        const actual = mm.parseURL(url, apiKey);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url without port number', () => {
        const mm = new Mattermost('localhost', 'test_token');
        const url = 'http://127.0.0.1/queries/1/source#2';
        const apiKey = 'sample_api_key';
        const expected = 'http://127.0.0.1/embed/query/1/visualization/2?api_key=sample_api_key';

        const actual = mm.parseURL(url, apiKey);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url with huge redash query number', () => {
        const mm = new Mattermost('localhost', 'test_token');
        const url = 'http://127.0.0.1/queries/123456789/source#987654321';
        const apiKey = 'sample_api_key';
        const expected = 'http://127.0.0.1/embed/query/123456789/visualization/987654321?api_key=sample_api_key';

        const actual = mm.parseURL(url, apiKey);
        assert.equal(actual, expected);
    });

    it('input invalid Redash visualization url without viz number', () => {
        const mm = new Mattermost('localhost', 'test_token');
        const url = 'http://localhost:5000/queries/1/source';
        const apiKey = 'sample_api_key';

        assert.throws(() => mm.parseURL(url, apiKey), Error);
    });

    it('input invalid api_key with empty string', () => {
        const mm = new Mattermost('localhost', 'test_token');
        const url = 'http://localhost:5000/queries/1/source#2';
        const apiKey = '';

        assert.throws(() => mm.parseURL(url, apiKey), Error);
    });
});

describe('testing makeCommandResponse', () => {
    it('input valid arguments', async () => {
        const mm = new Mattermost('localhost', 'test_token');
        const query = 'http://redash/queries/1/source#2';
        const fileLink = 'http://mattermost/publiclink';

        const actual = await mm.makeCommandResponse(query, fileLink);

        assert.equal(actual.response_type, 'in_channel');
        assert.include(actual.attachments[0].text, query);
        assert.include(actual.attachments[0].text, fileLink);
        assert.include(actual.attachments[0].image_url, fileLink);
    });
});

describe('testing makeErrorResponse', () => {
    it('input valid arguments', async () => {
        const mm = new Mattermost('localhost', 'test_token');
        const err = new Error('test error');

        const actual = await mm.makeErrorResponse(err);

        assert.equal(actual.response_type, 'ephemeral');
        assert.include(actual.text, err.message);
    });
});