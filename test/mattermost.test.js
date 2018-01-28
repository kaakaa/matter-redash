/*global describe it beforeEach: true*/
/*eslint max-nested-callbacks: ["error", 3]*/
/*eslint no-undef: 2*/
const assert = require('chai').assert; // eslint-disable-line node/no-unpublished-require

const Mattermost = require('../app/mattermost');

const mmClientStub = {
    setUrl(arg) {},
    setToken(arg) {}
};

describe('testing uploadFile', () => {

});

describe('testing parseURL', () => {
    let mm;
    beforeEach((done) => {
        mm = new Mattermost(mmClientStub, 'localhost', 'test_token');
        done();
    });
    it('input valid Redash visualizatoin url', () => {
        const url = 'http://localhost:5000/queries/1/source#2';
        const apiKey = 'sample_api_key';
        const expected = 'http://localhost:5000/embed/query/1/visualization/2?api_key=sample_api_key';

        const actual = mm.parseURL(url, apiKey);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url with https', () => {
        const url = 'https://localhost:5000/queries/1/source#2';
        const apiKey = 'sample_api_key';
        const expected = 'https://localhost:5000/embed/query/1/visualization/2?api_key=sample_api_key';

        const actual = mm.parseURL(url, apiKey);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url with ip_addr', () => {
        const url = 'http://127.0.0.1:5000/queries/1/source#2';
        const apiKey = 'sample_api_key';
        const expected = 'http://127.0.0.1:5000/embed/query/1/visualization/2?api_key=sample_api_key';

        const actual = mm.parseURL(url, apiKey);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url without port number', () => {
        const url = 'http://127.0.0.1/queries/1/source#2';
        const apiKey = 'sample_api_key';
        const expected = 'http://127.0.0.1/embed/query/1/visualization/2?api_key=sample_api_key';

        const actual = mm.parseURL(url, apiKey);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url with huge redash query number', () => {
        const url = 'http://127.0.0.1/queries/123456789/source#987654321';
        const apiKey = 'sample_api_key';
        const expected = 'http://127.0.0.1/embed/query/123456789/visualization/987654321?api_key=sample_api_key';

        const actual = mm.parseURL(url, apiKey);
        assert.equal(actual, expected);
    });

    it('input invalid Redash visualization url without viz number', () => {
        const url = 'http://localhost:5000/queries/1/source';
        const apiKey = 'sample_api_key';

        assert.throws(() => mm.parseURL(url, apiKey), Error);
    });

    it('input invalid api_key with empty string', () => {
        const url = 'http://localhost:5000/queries/1/source#2';
        const apiKey = '';

        assert.throws(() => mm.parseURL(url, apiKey), Error);
    });
});

describe('testing makeCommandResponse', () => {
    let mm;
    beforeEach((done) => {
        mm = new Mattermost(mmClientStub, 'localhost', 'test_token');
        done();
    });
    it('input valid arguments', async () => {
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
    let mm;
    beforeEach((done) => {
        mm = new Mattermost(mmClientStub, 'localhost', 'test_token');
        done();
    });
    it('input valid arguments', async () => {
        const err = new Error('test error');

        const actual = await mm.makeErrorResponse(err);

        assert.equal(actual.response_type, 'ephemeral');
        assert.include(actual.text, err.message);
    });
});