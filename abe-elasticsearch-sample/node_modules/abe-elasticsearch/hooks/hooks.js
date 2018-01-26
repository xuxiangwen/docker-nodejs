'use strict'
var path = require('path')
var esconnection = require('../modules/esconnection')

var hooks = {
  afterPublish: function (result, postPath, abe) {
    if(abe.config.elasticsearch && abe.config.elasticsearch.active){
      var es = new esconnection(abe)
      const revisionPath = path.join(abe.config.root, abe.config.data.url, result.abe_meta.link.replace(`.${abe.config.files.templates.extension}`, '.json'))
      const link = result.abe_meta.link
      const template = result.abe_meta.template
      const content = abe.cmsData.file.get(revisionPath)

      if(abe.config.elasticsearch.templates){
        if(typeof abe.config.elasticsearch.templates[template] != 'undefined') {
          es.client.indices.create({  
            index: this.index + '_' + template
          },function(err,resp,status) {
            if(err && err.statusCode !== 400) {
              console.log(err);
            }
            es.client.index({
              index: es.index + '_' + template,
              id: link,
              type: template,
              body: content
            });
          });
        }
      } else {
        es.client.index({
          index: es.index + '_' + template,
          id: link,
          type: template,
          body: content
        });
      }
    }

    return result;
  },
  afterUnpublish: function (path, postPath, json, abe) {
    if(abe.config.elasticsearch && abe.config.elasticsearch.active){
      var es = new esconnection(abe)
      const link = json.abe_meta.link
      const template = json.abe_meta.template

      var result = es.client.delete({
        index: es.index + '_' + template,
        id: link,
        type: template
      });
    }

    return path;
  },
  afterDelete: function (path, json, abe) {
    if(abe.config.elasticsearch && abe.config.elasticsearch.active){
      var es = new esconnection(abe)
      es.client.delete({
        index: es.index + '_' + template,
        id: path
      });
    }

    return path;
  }
};

exports.default = hooks;
