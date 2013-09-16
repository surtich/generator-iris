'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var irisUtils = require('./util.js');

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
  var initFile = this.readFileAsString('www/app/init.js');

  var regExp = new RegExp("iris\.path *= *({([^;]|\n)*})[^;]*;");

  var result = regExp.exec(initFile);
  if (result) {
    var irisPath = JSON.parse(result[1]);
    for (i = 0; i < names.length; i++) {
      var name = this.normalizeName(names[i]);
      this.createHashs(irisPath, component, name);
    }
    
    var start = initFile.substring(0, result.index);
    var end = initFile.substring(result.index + result[0].length);

    initFile = start + "iris.path = " + JSON.stringify(irisPath, null, "\t") + ";" + end;

    this.write('www/app/init.js', initFile);    

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


