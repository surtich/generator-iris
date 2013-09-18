'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');

var CreateComponentGenerator = module.exports = function CreateComponentGenerator(args, options, config) {
  ScriptBase.apply(this, arguments);
};

util.inherits(CreateComponentGenerator, ScriptBase);

CreateComponentGenerator.prototype.app = function app() {
  try {
      this.newFromInit();
    } catch (e) {
      console.error(e);
    }
};