var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexName = "robot";

// var indexName = "ac_test";

// client.ping({
//     requestTimeout: 30000,
// }, function (error) {
//     if (error) {
//         console.error('elasticsearch cluster is down!');
//     } else {
//         console.log('All is well');
//     }
// });
//
// client.indices.exists({
//     index: indexName
// }).then(function (exists) {
//     console.log(indexName + ' exists=' + exists );
// }, function (error) {
//     console.log(error);
// });



/**
* Delete an existing index
*/
function deleteIndex() {
    return client.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex() {
    return client.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists() {
    return client.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

function initMapping() {
    return client.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                title: { type: "text" },
                content: { type: "text" },
                suggest: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple",
                    payloads: true
                }
            }
        }
    });
}
exports.initMapping = initMapping;

function addDocument(document) {
    return client.index({
        index: indexName,
        type: "document",
        body: {
            title: document.title,
            content: document.content,
            suggest: {
                input: document.title.split(" "),
                output: document.title,
                payload: document.metadata || {}
            }
        }
    });
}
exports.addDocument = addDocument;

function suggest(input) {
    return client.suggest({
        index: indexName,
        type: "question",
        body: {
            "suggest": {
                "my-suggestion": {
                    "text": input,
                    "phrase": {
                        "field": "body",
                        "highlight": {
                            "pre_tag": "<em>",
                            "post_tag": "</em>"
                        }
                    }
                }
            }

        }
    })
}
exports.suggest = suggest;

function search(input) {
    return client.search({
        index: indexName,
        type: "question",
        body: {
            query: {
                match: {
                    question: input
                }
            }
        }
    })
}
exports.search = search;