'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var UiCreateGenerator = module.exports = function UiCreateGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the ui-create subgenerator with the argument ' + this.name + '.');
};

util.inherits(UiCreateGenerator, yeoman.generators.NamedBase);

UiCreateGenerator.prototype.files = function files() {
  var today = new Date();

  var prefix = today.getUTCMonth() + 1;
  prefix += '-' + today.getDate();
  prefix += '-' + today.getFullYear();

  var filename = prefix + '-' + this._.slugify(this.name) + '.md';
  this.write('www/app/ui/' + filename, '# ' + this.name);
};
