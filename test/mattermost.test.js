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
        const url = "https://dockerhost:5000/queries/123/source#456";
        const api_key = "sample_api_key";
        const expected = "https://dockerhost:5000/embed/query/123/visualization/456?api_key=sample_api_key";

        const actual = mm.parseURL(url, api_key);
        assert.equal(actual, expected);
    });

    it('input Redash visualization url without viz number', () => {
        const mm = new Mattermost("localhost", "test_token");
        const url = "http://localhost:5000/queries/1/source";

        assert.throws(() => mm.parseURL(url,""), Error);
    });
});