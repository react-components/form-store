/**
 * Module dependencies
 */

var Emitter = require('component-emitter');
var Input = require('./input');

/**
 * Enum
 */

var PROPS = '_props';
var ACTION = 'action';
var METHOD = 'method';
var TYPE = 'type';
var NAME = 'name';

/**
 * Expose the Form constructor
 */

module.exports = Form;

/**
 * Construct a form by name
 */

function Form(name, config) {
  var self = this;
  self[NAME] = name;
  self.update(config);
}
Emitter(Form.prototype);

/**
 * Get a property for the form
 */

Form.prototype.get = function(key) {
  return this[PROPS][key];
};

Form.prototype.update = function(config) {
  var self = this;
  config = config || {};

  // TODO clear any event listeners
  self.inputs = {};
  var values = self.values = {};
  self[PROPS] = config;

  var input = config.input;
  if (input) {
    var i;
    for (var k in input) {
      i = input[k];
      if (!i) continue;
      if (i[TYPE] === 'hidden') values[k] = i.value;
      else self.input(k, i);
    }
  }

  return self;
};

/**
 * Submit the form
 */

Form.prototype.submit = function(updates) {
  var self = this;
  var values = self.values;
  self.set(updates);
};

/**
 * Update values
 */

Form.prototype.set = function(name, value) {
  var self = this;
  if (!name) return self;

  var values = self.values;

  if (typeof name === 'string') {
    values[name] = value;
  } else {
    for (var k in name) {
      values[k] = name[k];
    }
  }

  return self;
};

/**
 * Reset the form
 */

Form.prototype.reset = function() {

};

/**
 * Set a config for an input
 */

Form.prototype.input = function(name, config) {
  var self = this;
  var inputs = self.inputs;
  var input = inputs[name] = inputs[name] = new Input(name, self);
  if (config) input.update(config);
  return input;
};

Form.prototype.toString = function() {
  var self = this;
  var props = self[PROPS];
  return '<form ' + METHOD + '=' + JSON.stringify(props[METHOD]) + ' ' +
                   ACTION + '=' + JSON.stringify(props[ACTION]) + ' ' +
                   NAME + '=' + JSON.stringify(self[NAME]) + ' />';
};

function setter(name) {
  return function(value) {
    this[PROPS][name] = value;
  };
}
