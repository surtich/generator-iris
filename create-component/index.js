'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var CreateComponentGenerator = module.exports = function CreateComponentGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the create-component subgenerator with the argument ' + this.name + '.');
};

util.inherits(CreateComponentGenerator, yeoman.generators.NamedBase);

CreateComponentGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    type: 'list',
    name: 'component',
    message: 'Which component would you like to create?',
    default: 'ui',
    choices: [{
      name: 'UI component',
      value: 'ui'
    }, {
      name: 'Screen component',
      value: 'screen'
    }, {
      name: 'Resource component',
      value: 'resource',
      checked: true
    }]
  }];

  this.prompt(prompts, function (props) {
    this.component = props.component;
    cb();
  }.bind(this));
};

CreateComponentGenerator.prototype.app = function app() {
  this.mkdir('www/app/' + this.component + '/' + this.name);
  this.template('_component.js', 'www/app/' + this.component + '/' + this.name + '.js');
  if (this.component === "ui" || this.component === "screen") {
  	this.template('_component.html', 'www/app/' + this.component + '/' + this.name + '.html');
  }
  
  var initFile = this.readFileAsString('www/app/init.js');

  var regExp = new RegExp("iris\.path *= *({(.|\n)*);.*// *End of iris.path definition. Do not remove or modify this comment");

  var result = regExp.exec(initFile);
  if (result) {
  	var irisPath = JSON.parse(result[1]);
  	if (this.component === "ui" || this.component === "screen") {
  		irisPath[this.component][this.name] = {
  			js: this.component + "/" + this.name + ".js",
  			html: this.component + "/" + this.name + ".html",
  		};
  	} else {
  		irisPath[this.component][this.name] = this.component + "/" + this.name + ".js";
  	}
  	
  	var start = initFile.substring(0, result.index);
  	var end = initFile.substring(result.index + result[0].length);

  	initFile = start + "iris.path = " + JSON.stringify(irisPath, null, "\t") + "; //End of iris.path definition. Do not remove or modify this comment" + end;

	this.write('www/app/init.js', initFile);  	

  }
};
