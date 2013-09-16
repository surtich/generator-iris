'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');

var CreateComponentGenerator = module.exports = function CreateComponentGenerator(args, options, config) {

  ScriptBase.apply(this, arguments);

};

util.inherits(CreateComponentGenerator, ScriptBase);

CreateComponentGenerator.prototype.askFor = function askFor() {
  var cb = this.async();


  var prompts = [];

  if (this.arguments.length == 0) {
    prompts.push({
      type: "input",
      name: "name",
      message: "What is the name of de component (use blanks for add multiple components)",
      default: "myComponent",
      validate: function( value ) {
        var pass = value.match(/^.*[^ ]+.*$/);
        if (pass) {
          return true;
        } else {
          return "Please enter a valid component name";
        }
      }
    });    
  } else {
    this.names = this.arguments;
  }

  prompts.push({
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
  });

  this.prompt(prompts, function (props) {
    this.component = props.component;
    if (props.name) {
      this.names = props.name.replace(/ +/g,' ').trim().split(' ');  
    }
    cb();
  }.bind(this));
};

CreateComponentGenerator.prototype.app = function app() {
  var i = 0;
  for (; i < this.names.length; i++) {
    this.createComponent(this.component, this.names[i]);  
  }
  this.updateInit(this.component, this.names);
};
