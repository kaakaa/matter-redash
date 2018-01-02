# Matter-Redash

[Redash](https://redash.io) integrations for Mattermost

![Screenshot](https://raw.githubusercontent.com/kaakaa/matter-redash/images/matter-redash.gif)

## Configure

### Matter-Redash

`Matter-Redash` needs [Mattermost Personal Access Token](https://docs.mattermost.com/developer/personal-access-tokens.html) and [Redash API Key](http://help.redash.io/article/128-api-key-authentication).

And writing it in [config/.default.json](https://github.com/kaakaa/matter-redash/blob/master/config/.default.json).

### Mattermost Custom Slash Commands

Create [**Custom Slash Command**](https://docs.mattermost.com/developer/slash-commands.html#custom-slash-command) for `matter-redash`.

* Title: `redash`
* TriggerWord: `redash`
* RequestURL: `http://${matter-redash}:8888/redash`

## Run Server

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