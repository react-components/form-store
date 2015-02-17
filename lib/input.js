/**
 * Module dependencies
 */

var Emitter = require('events').EventEmitter;
var inherits = require('util').inherits;

/**
 * Expose the Input constructor
 */

module.exports = Input;

/**
 * Create an input
 */

function Input(name, form) {
  var self = this;
  Emitter.call(self);
  self.name = name;
  self._form = form;
}
inherits(Input, Emitter);

/**
 * Set the value of the input
 */

Input.prototype.set = function(value) {
  var self = this;
  self.isDirty = value !== self.__original_value;
  self.value = value;
  self._form.values[self.name] = value;
  self.emit('change', value);
  return self;
};

/**
 * Update an input configuration
 */

Input.prototype.update = function(config) {
  var self = this;

  if (!config) return self;

  for (var k in config) {
    if (k === 'value') {
      if (!self.isDirty) self.value = self._form.values[self.name] = config.value;
      self.__original_value = config.value;
    } else {
      self[k] = config[k];
    }
  }

  return self;
};

/**
 * Reset the input
 */

Input.prototype._reset = function() {
  var self = this;
  self.value = self._form.values[self.name] = self.__original_value;
  self.isDirty = false;
  return self;
};

/**
 * Destroy the input
 */

Input.prototype._destroy = function() {
  var self = this;
  delete self._form.values[self.name];
  delete self._form.inputs[self.name];
  self.removeAllListeners();
  return self;
};
