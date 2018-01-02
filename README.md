# Matter-Redash

[Redash](https://redash.io) integrations for Mattermost

## Configure

### Matter-Redash

`Matter-Redash` needs [Mattermost Personal Access Token](https://docs.mattermost.com/developer/personal-access-tokens.html) and [Redash API Key](http://help.redash.io/article/128-api-key-authentication).

[config/.default.json](https://github.com/kaakaa/matter-redash/blob/master/config/.default.json)

### Mattermost Custom Slash Commands

Create [**Custom Slash Command**]([Slash Commands — Mattermost 4\.5 documentation](https://docs.mattermost.com/developer/slash-commands.html#custom-slash-command)) for `matter-redash`.

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

## LISENCE

`Matter-Redash` is licensed under MIT.