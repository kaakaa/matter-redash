/*global describe it beforeEach: true*/
/*eslint max-nested-callbacks: ["error", 3]*/
/*eslint no-undef: 2*/
const assert = require('chai').assert; // eslint-disable-line node/no-unpublished-require
const sinon = require('sinon'); // eslint-disable-line node/no-unpublished-require

const Mattermost = require('../app/mattermost');

const mmClientStub = {
    setUrl(arg1) {
        console.debug('stubbing `setUrl` with ' + arg1); // eslint-disable-line no-console
    },
    setToken(arg1) {
        console.debug('stubbing `setToken` with ' + arg1); // eslint-disable-line no-console
    },
    uploadFile(arg1, arg2) {
        console.debug('stubbing `uploadFile` with ' + arg1 + ', ' + arg2); // eslint-disable-line no-console
    },
    createPost(arg1, arg2, arg3) {
        console.debug('stubbing `createPost` with ' + arg1 + ', ' + arg2 + ', ' + arg3); // eslint-disable-line no-console
    },
    getFilePublicLink(arg1) {
        console.debug('stubbing `getFilePublicLink` with ' + arg1); // eslint-disable-line no-console
    },
    deletePost(arg1) {
        console.debug('stubbing `deletePost` with ' + arg1); // eslint-disable-line no-console
    }
};

describe('testing uploadFile', () => {
    let mm;
    beforeEach((done) => {
        mm = new Mattermost(mmClientStub, 'localhost', 'test_token');
        done();
    });
    it('input valid args', async () => {
        const channelId = 'sample_channel_id';
        const text = 'http://localhost:5000/queries/1/source#2';
        const apiKey = 'sample_api_key';
        const webshot = (arg1) => {
            return 'webshot_image with ' + arg1;
        };

        const makeImageFormStub = sinon.stub(mm, 'makeImageFormData');
        makeImageFormStub.returns({
            getBoundary() {
                return 'stub';
            }
        });

        const expected = {stub: true, message: 'Uploading file is success.'};
        const uploadFileStub = sinon.stub(mmClientStub, 'uploadFile');
        uploadFileStub.returns(expected);

        const actual = await mm.uploadFile(channelId, text, apiKey, webshot);

        assert.equal(actual, expected);
    });
});

describe('testing getFilePublicLink', () => {
    let mm;
    beforeEach((done) => {
        mm = new Mattermost(mmClientStub, 'localhost', 'test_token');
        done();
    });
    it('input valid args', async () => {
        const channelId = 'channel_id';
        const fileId = 'file_id';

        const expectedPostId = 'sample_post_id';
        const createPostStub = sinon.stub(mmClientStub, 'createPost');
        createPostStub.returns({id: expectedPostId});

        const expectedLink = 'http://mattermost/publicLink/sample';
        const getFilePublicLinkStub = sinon.stub(mmClientStub, 'getFilePublicLink');
        getFilePublicLinkStub.returns({link: expectedLink});

        const actual = await mm.getFilePublicLink(channelId, fileId);

        assert.equal(actual.post_id, expectedPostId);
        assert.equal(actual.public_link, expectedLink);
    });
});

describe('testing deletePost', () => {
    let mm;
    beforeEach((done) => {
        mm = new Mattermost(mmClientStub, 'localhost', 'test_token');
        done();
    });
    it('input valid args', async () => {
        const postId = 'post_id';

        const expected = {stub: true, message: 'Deletin post is success.'};
        const stub = sinon.stub(mmClientStub, 'deletePost');
        stub.returns(expected);

        const actual = await mm.deletePost(postId);
        assert.equal(actual, expected);
    });
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
