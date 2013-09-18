'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var irisUtils = require('./util.js');
var fs = require('fs');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.normalizeName = function(name) {
  return {
    name: name,
    pathName: name.replace(/^.*\/([^/]+)$/,
        function (match, p1, offset, string){
          return p1;
        }),
    irisName: name.replace(/\//g,'.')
  }
}

Generator.prototype.createComponent = function (component, name) {
  var normalizedName = this.normalizeName(name);
  if (component === "ui" || component === "screen") {
    this.mkdir('www/app/' + component + '/' + normalizedName.name);
    this.template('_component.js', 'www/app/' + component + '/' + normalizedName.name + '/' + normalizedName.pathName + '.js', {component:component, name:normalizedName.irisName});
    this.template('_component.html', 'www/app/' + component + '/' + normalizedName.name + '/'+ normalizedName.pathName + '.html', {component:component, name:normalizedName.irisName});
  } else {
    this.template('_component.js', 'www/app/' + component + '/' + name + '.js', {component:component, name:normalizedName.irisName});
  }
};

Generator.prototype.updateInit = function (component, names) {
  var i = 0;
  var result = irisUtils.readObject('www/app/init.js', 'iris.path');
  if (result.object) {    
    for (i = 0; i < names.length; i++) {
      var name = this.normalizeName(names[i]);
      this.createHashs(result.object, component, name);
    }
    result.updater(result.object, this.write, this);
  } else {
    console.log("iris.path not found in www/app/init.js");
  }
};

Generator.prototype.createHashs = function (irisPath, component, name) {
  var hashs = name.name.split('/');
  var obj = irisPath[component];
  for (var i = 0; i < hashs.length; i++) {
    var hash = hashs[i];
    if (!obj[hash]) {
     obj[hash] = {};
    }
    if (i < hashs.length - 1 || component != 'resource') {
      obj = obj[hash];  
    }
  }

  if (component === "ui" || component === "screen") {
    obj['js'] = component + "/" + name.name + "/" + name.pathName + ".js";
    obj['html'] = component + "/" + name.name + "/" + name.pathName + ".html";
  } else {
    obj[hash] = component + "/" + name.name + ".js";
  } 
  
}

Generator.prototype.newFromInit = function() {
  var that = this;
  var changes = false;
  function iterate(obj, preDir) {
    for (var hash in obj) {
      var dir = preDir || "";
      if (dir) {
        dir += "/";   
      }
      dir += hash;
      
      if (typeof obj[hash] === 'object') {
        iterate(obj[hash], dir);
      } else {
        var componentHash = "iris.path." + dir.replace(/\//g, '.');
        var filePath = 'www/app/' + obj[hash];
        var regExp = /^([^/]+).*\/([^/.]+)\.([^/.]+)$/;

        var result = regExp.exec(obj[hash]);
        if (result !== null) {
          that.component = result[1];
          that.name = result[2];
          that.hash = componentHash;
          var componentExt = result[3];
        } else {
          console.log("Bad format " + obj[hash]);
        }
        
        if (!fs.existsSync(filePath)) {
          that.template('_component.' + componentExt, filePath);
          changes = true;
        }
      }
    }
  }
  var result = irisUtils.readObject('www/app/init.js', 'iris.path');
  if (result.object) {
    iterate(result.object);
    if (!changes) {
      console.log("Nothing to do!");
    }
  }
} 
