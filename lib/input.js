/**
 * Module dependencies
 */

var Emitter = require('component-emitter');

/**
 * Expose the Input constructor
 */

module.exports = Input;

/**
 * Enum
 */

var VALUE = 'value';
var CHANGE = 'change';
var IS_VALID = 'isValid';
var TYPE = 'type';
var NAME = 'name';
var CONFIG = '_c';
var DIRTY = 'isDirty';

/**
 * Create an input
 */

function Input(name, form) {
  this[NAME] = name;
  this.form = form;
  this.validations = {};
}
Emitter(Input.prototype);

/**
 *
 */

Input.prototype.get = function(name) {
  var self = this;
  if (name === VALUE) return self[name];
  return self[CONFIG][name];
};

/**
 * Set the value of the input
 */

Input.prototype.set = function(value) {
  var self = this;
  self[DIRTY] = true;
  self[VALUE] = value;
  self.emit(CHANGE);
  self.form.emit(CHANGE, self);
  return self;
};

/**
 * Set validity
 */

Input.prototype.setValidity = function(name, status) {
  var self = this;
  var validations = self.validations;
  validations[name] = status;

  self[IS_VALID] = true;
  for (var k in validations) {
    self[IS_VALID] = self[IS_VALID] && validations[k];
  }

  return self;
};

/**
 * Update an input configuration
 */

Input.prototype.update = function(config) {
  var self = this;

  if (!config) return self;

  self[CONFIG] = config;
  if (!self[DIRTY]) self[VALUE] = config[VALUE];

  return self;
};

Input.prototype.toString = function() {
  var self = this;
  var config = self[CONFIG];
  var props = [];

  var value = JSON.stringify(self[VALUE]);

  if (!config[VALUE]) props.push(VALUE + '=' + value);

  for (var k in config) {
    if (k === 'value') props.push(VALUE + '=' + value);
    else props.push(k + '=' + JSON.stringify(config[k]));
  }

  var type = config[TYPE] || 'text';
  var tag = type === 'select' ? type : (type === 'textarea' ? type : 'input');

  return '<' + tag + ' '  + NAME + '=' + JSON.stringify(self[NAME]) + ' ' + props.join(' ') + ' />';
};
