'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var IrisGenerator = module.exports = function IrisGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(IrisGenerator, yeoman.generators.Base);

IrisGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
    {
      name: 'appName',
      message: 'What is the name of the application?',
      default: 'Iris test'
    },
    {
      type: 'confirm',
      name: 'bootstrap',
      message: 'Would you like to enable Bootstrap?',
      default: true
    }
  ];

  this.prompt(prompts, function (props) {
    this.bootstrap = props.bootstrap;
    this.appName = props.appName;

    cb();
  }.bind(this));
};

IrisGenerator.prototype.app = function app() {
  this.mkdir('www');
  this.mkdir('www/app');
  this.mkdir('www/app/lang');
  this.mkdir('www/app/resource');
  this.mkdir('www/app/screen');
  this.mkdir('www/app/ui');


  this.mkdir('www/css');
  this.mkdir('www/font');
  this.mkdir('www/img');
  this.mkdir('www/js');
  this.mkdir('www/test');

  this.template('_index.html', 'www/index.html');
  this.template('_package.json', 'package.json');
  this.template('_iris.json', 'iris.json');
  this.template('_Gruntfile.js', 'Gruntfile.js');
  this.template('_bower.json', 'bower.json');

  this.copy('_init.js', 'www/app/init.js');
  this.copy('_en-us.js', 'www/app/lang/en-us.js');

  this.copy('_welcome.js', 'www/app/screen/welcome.js');
  this.copy('_welcome.html', 'www/app/screen/welcome.html');
};

IrisGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
