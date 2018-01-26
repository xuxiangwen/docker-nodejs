'use strict'
var path = require('path')
var elasticsearch = require('elasticsearch')

function esclient (abe) {
  var host = "localhost"
  var port = 9200
  this.index = path.basename(abe.config.root)
  this.error = null
  this._pathTemplate = abe.Manager.instance.pathTemplates
  this._extension = '.' + abe.config.files.templates.extension

  if(abe.config.elasticsearch){
    var elt = abe.config.elasticsearch
    host = (elt.hasOwnProperty("host"))?elt.host:host
    port = (elt.hasOwnProperty("port"))?elt.port:port
    this.index = (elt.hasOwnProperty("index"))?elt.index:this.index
  }

  if(port != ""){
    host = host + ':' + port
  }
  this.client = new elasticsearch.Client({
    host: host,
    log: 'error'
  })

  this.indices = []


  // console.log('============= HOST ===============')
  // console.log(host)
  // this.error = this.client.ping({
  //   requestTimeout: 3000,
  //   hello: "elasticsearch!"
  // }, function (error) {
  //   if (error) {
  //     console.trace('elasticsearch cluster is down!')
  //     return error
  //   }
  // })

  /**
   * Check if an index already exist in elasticsearch
   * @param  {[type]}   templates [description]
   * @param  {[type]}   extension [description]
   * @param  {Function} callback  [description]
   * @return {[type]}             [description]
   */
  this.getIndices = function(templates, extension, callback){
    Array.prototype.forEach.call(templates, function(template) {
      template = path.basename(template, extension)
      const index = this.index + '_' + template
      this.client.indices.exists({ index: index, ignoreUnavailable: true }, function (err, exists) {
        if(exists === true){
          this.indices.push(index)
        }
        callback(this.indices)
      }.bind(this))
    }.bind(this))
  }

  this.initIndices = function(templates, extension, callback){
    Array.prototype.forEach.call(templates, (template) => {
      template = path.basename(template,extension)
      if(this.isInIndices(template)){
        const index = this.index + '_' + template
        const conf = this.getConfig(template)
        const settings = conf.settings
        this.client.indices.create({  
          index: index,
          body: conf.settings
        },function(err,resp,status) {
          if(Object.keys(conf.mappings).length > 0 && conf.mappings.constructor === Object){
            this.client.indices.putMapping({
              index: index,
              type: template,
              body: conf.mappings
            }, function(err, result){
              callback(resp)
            }.bind(this))
          } else {
            callback(resp)
          }
        }.bind(this))
      } else {
        callback(true)
      }
    })
  }

  /**
   * Delete existing indices in Elasticsearch
   * @param  {[type]}   templates [description]
   * @param  {[type]}   extension [description]
   * @param  {Function} callback  [description]
   * @return {[type]}             [description]
   */
  this.resetIndices = function(templates, extension, callback){
    Array.prototype.forEach.call(templates, (template) => {
      template = path.basename(template,extension)
      const index = this.index + '_' + template
      this.client.indices.exists({ index : index, ignoreUnavailable: true }, function (err, exists) {
        if(exists === true){
          this.client.indices.delete({index: index}, function (err, result) {
          }.bind(this));
        }
        callback(index)
      }.bind(this))
    })
  }

  this.isInIndices = function(template){
    if(abe.config.elasticsearch && abe.config.elasticsearch.active){
      if(abe.config.elasticsearch.templates){
        if(typeof abe.config.elasticsearch.templates[template] != 'undefined'){
          return abe.config.elasticsearch.templates[template]
        }
      } else {
        return true
      }
    }

    return false
  }

  this.getConfig = function(template){
    let config = {
      "settings": {
        "index":{
          "mapping":{
            "ignore_malformed": true
          }
        }
      },
      "mappings": false
    }
    if(abe.config.elasticsearch && abe.config.elasticsearch.active){
      if(abe.config.elasticsearch.templates){
        if(typeof abe.config.elasticsearch.templates[template] != 'undefined'){
          if (abe.config.elasticsearch.templates[template]['settings'])
            config.settings = abe.config.elasticsearch.templates[template]['settings']
          if (abe.config.elasticsearch.templates[template]['mappings'])
            config.mappings = abe.config.elasticsearch.templates[template]['mappings']
        }
      }
    }

    return config
  }
}

module.exports = esclient;
