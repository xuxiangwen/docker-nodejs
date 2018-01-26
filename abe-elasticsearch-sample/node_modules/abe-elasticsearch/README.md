# abe-elasticsearch
Add search feature on your Abe frontend with Elasticsearch

## Introduction
This plugin will index all your published content to Elasticsearch so that you can add a search feature to your static frontend !

## Pre-requisites
Elasticsearch installed

## Installation
from your blog root directory:
```abe install abecms/abe-elasticsearch```

If you want to install a specific github version:
```abe install abecms/abe-elasticsearch#v2.0.0```

You can also modify your abe.json config file:
```
  "plugins": [
    "abecms/abe-elasticsearch"
  ]
```

Then from your blog root directory:
``` abe install ```

## Configuration
Configure the Elasticsearch parameters in your abe.json file.

```
"elasticsearch":{
  "active":"true",
  "host": "127.0.0.1",
  "port": "9200",
  "index": "my_index",
  "templates": {
      "template-1": {
        "settings": {},
        "mappings": {
          "dynamic": "false",
          "properties": {
            "abe_meta": {
              "type": "object",
              "properties": {
                "link": {
                  "type": "text",
                  "index": "not_analyzed"
                }
              }
            },
            "title": {
              "type": "text"
            },
            "name": {
              "type": "text"
            }
          }
        }
      },
      "template-2": {
        "settings": {},
        "mappings": {
          "dynamic": "false",
          "properties": {
            "abe_meta": {
              "type": "object",
              "properties": {
                "link": {
                  "type": "text",
                  "index": "not_analyzed"
                }
              }
            },
            "title": {
              "type": "text"
            }
          }
        }
      }
    }
  }
 }
```

- you can deactivate this plugin by setting "active" to false
- If you don't provide an "index" prefix value, the plugin will take the name of your project directory. 

- :point_up: Caution: This index is only a prefix used to be prepended to all the templates you want to index. In Elasticsearch, it's not possible to have 2 properties with the same name (like title for one template and title for another template) in a same index with different types. Therefore, we need to create a specific index for each template. ie. my_index_article, my_index_post, ...
- the attribute "templates" is optional. It's a json of templates you want to index. If a content is not related to one of these templates, it won't be indexed. You may define specific settings (see ElasticSearch for details) for one template (== one index in ElasticSearch). And you may define a specific mapping (like in the example, see ElasticSearch doc:https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html).
If you don't define a mapping for your template/index, Elastic will try to guess it and could encounter problems trying to figure it out by itself (but it works often).
In this case, you could define a template/index this way:
```
"elasticsearch":{
  "active":"true",
  "host": "127.0.0.1",
  "port": "9200",
  "index": "my_index",
  "templates": {
    "template-1": {}
  }
```

As an advice, if you define a mapping for your template/index, add ```"dynamic": "false"``` to your mapping so that ElasticSearch don't try to add additional fields dynamically.

## How it works

### On your Abe CMS
Every time you publish a content, abe-elasticsearch will publish the whole document to Elasticsearch.
Every time you unpublish a content, abe-elasticsearch will delete this content from Elasticsearch.

The elasticsearch console : ```/abe/plugin/abe-elasticsearch/console```
It will display the number of indexed posts in Elasticsearch. You'll be able to launch a full index or reindex of your blog to elasticsearch.

### On your client
Note: If you want to request Elasticsearch directly from the client, configure your config/elasticsearch.yml configuration file with:

```
http.cors.enabled : true
 
http.cors.allow-origin : "*"
http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length

```

You'll find a specific recipe on this plugin here: https://github.com/abecms/recipe-elasticsearch
