[![Build Status](https://travis-ci.org/kaakaa/matter-redash.svg?branch=master)](https://travis-ci.org/kaakaa/matter-redash)
[![codecov](https://codecov.io/gh/kaakaa/matter-redash/branch/master/graph/badge.svg)](https://codecov.io/gh/kaakaa/matter-redash)
[![](https://images.microbadger.com/badges/image/kaakaa/matter-redash.svg)](https://microbadger.com/images/kaakaa/matter-redash "Get your own image badge on microbadger.com")

# Matter-Redash

[Redash](https://redash.io) integrations for Mattermost

![Screenshot](https://raw.githubusercontent.com/kaakaa/matter-redash/images/matter-redash.gif)

## Configure

### Matter-Redash

`Matter-Redash` needs [Mattermost Personal Access Token](https://docs.mattermost.com/developer/personal-access-tokens.html) and [Redash API Key](http://help.redash.io/article/128-api-key-authentication).

And writing it in [config/.default.json](https://github.com/kaakaa/matter-redash/blob/master/config/.default.json).

### Mattermost Configurations

Since `Matter-Redash` uses `Personal Access Token` and `Public Link` of Mattermost, you must enable that options form `System Console`.

* [Enable Personal Access Tokens](https://docs.mattermost.com/administration/config-settings.html#enable-personal-access-tokens)
* [Enable Public Links](https://docs.mattermost.com/administration/config-settings.html#public-links)

### Mattermost Custom Slash Command

Create [**Custom Slash Command**](https://docs.mattermost.com/developer/slash-commands.html#custom-slash-command) for `matter-redash`.

* Title: `redash`
* TriggerWord: `redash`
* RequestURL: `http://${matter-redash}:8888/redash`

## Run Server

### Docker

```
cp config/.default.json config/default.json
vi config/default.json

docker build -t matter-redash .
docker run \
  --rm \
  -p 8888:8888 \
  -v ${PWD}/config/default.json:/usr/local/src/config/default.json \
  kaakaa/matter-redash
```

### Command Line
```
cp config/.default.json config/default.json
vi config/default.json

yarn run server
```

## Execute Command

Post on Mattermost  

```
/redash http://redash.example.com/queries/1/source#2
```

**Redash URL must follow the format below**  
`http://${REDASH_HOST}/queries/${QUERY_ID}/source#{VISUALIZATION_ID}`

## Caution

On the specification of Mattermost, `Matter-Redash` created a temporary post to obtain the public link of the image file uploaded to the mattermost.
`Matter-Redash` deleted that post after obtaining the public link, but the message "post deleted" has been left.

## LISENCE

`Matter-Redash` is licensed under MIT.
