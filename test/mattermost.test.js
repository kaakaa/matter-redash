const config = require('config');

const chai = require('chai');
const assert = chai.assert;

const Mattermost = require('../app/mattermost')

describe('testin parseURL', () => {
    it('input valid Redash visualizatoin url', () => {
        const mm = new Mattermost("localhost", "test_token");
        const url = "http://localhost:5000/queries/1/source#2";
        const api_key = "sample_api_key";
        const expected = "http://localhost:5000/embed/query/1/visualization/2?api_key=sample_api_key";

        const actual = mm.parseURL(url, api_key);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url with https', () => {
        const mm = new Mattermost("localhost", "test_token");
        const url = "https://localhost:5000/queries/1/source#4";
        const api_key = "sample_api_key";
        const expected = "https://localhost:5000/embed/query/1/visualization/4?api_key=sample_api_key";

        const actual = mm.parseURL(url, api_key);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url with ip_addr', () => {
        const mm = new Mattermost("localhost", "test_token");
        const url = "http://127.0.0.1:5000/queries/1/source#2";
        const api_key = "sample_api_key";
        const expected = "http://127.0.0.1:5000/embed/query/1/visualization/2?api_key=sample_api_key";

        const actual = mm.parseURL(url, api_key);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url without port number', () => {
        const mm = new Mattermost("localhost", "test_token");
        const url = "http://127.0.0.1/queries/1/source#2";
        const api_key = "sample_api_key";
        const expected = "http://127.0.0.1/embed/query/1/visualization/2?api_key=sample_api_key";

        const actual = mm.parseURL(url, api_key);
        assert.equal(actual, expected);
    });

    it('input valid Redash visualizatoin url with huge redash query number', () => {
        const mm = new Mattermost("localhost", "test_token");
        const url = "http://127.0.0.1/queries/123456789/source#987654321";
        const api_key = "sample_api_key";
        const expected = "http://127.0.0.1/embed/query/123456789/visualization/987654321?api_key=sample_api_key";

        const actual = mm.parseURL(url, api_key);
        assert.equal(actual, expected);
    });

    it('input invalid Redash visualization url without viz number', () => {
        const mm = new Mattermost("localhost", "test_token");
        const url = "http://localhost:5000/queries/1/source";
        const api_key = "sample_api_key";

        assert.throws(() => mm.parseURL(url, api_key), Error);
    });

    it('input invalid api_key with empty string', () => {
        const mm = new Mattermost("localhost", "test_token");
        const url = "http://localhost:5000/queries/1/source#2";
        const api_key = "";

        assert.throws(() => mm.parseURL(url, api_key), Error);
    });
});