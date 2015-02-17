/**
 * Module dependencies
 */

var Emitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var Input = require('./input');

/**
 * Expose the Form constructor
 */

module.exports = Form;

/**
 * Construct a form by name
 */

function Form(config, client, name) {
  var self = this;
  Emitter.call(self);
  self.name = name;
  self.inputs = {};
  self.values = {};
  self._client = client;
  self.submit = self.submit.bind(self);
  self.update(config);
  self.isLoading = false;
  self.on('submit', function() {
    self.isLoading = true;
  });
  self.on('response', function() {
    self.isLoading = false;
  });
}
inherits(Form, Emitter);

/**
 * Update the form configuration
 */

Form.prototype.update = function(config, name) {
  var self = this;
  config = config || {};

  if (name && self.name !== name) {
    self.name = name;
    self.emit('rename', name);
  }

  if (self._hash && self._hash === config._hash) return self;

  self.method = config.method || self.method;
  self.action = config.action || self.action;

  var inputs = config.input || config.inputs || {};
  var input;
  for (var inputName in inputs) {
    if (!inputs.hasOwnProperty(inputName)) continue;
    input = self.inputs[inputName] = self.inputs[inputName] || new Input(inputName, self);
    input.update(inputs[inputName]);
  }

  for (var key in self.inputs) {
    if (!inputs[key]) self.inputs[key]._destroy();
  }

  self.emit('change');
  self._hash = config._hash;

  return self;
};

Form.prototype.format = function(cb) {
  var self = this;
  // TODO flush the validations
  self._client.format(self.method, self.action, self.values, cb);
  return self;
};

/**
 * Submit the form
 */

Form.prototype.submit = function(cb) {
  var self = this;
  var values = self.values;

  if (typeof cb === 'function') self.once('response', cb);

  self.emit('submit');
  self._client.submit(self.method, self.action, values, self.emit.bind(self, 'response'));
  return self;
};

/**
 * Update values
 */

Form.prototype.set = function(name, value) {
  var self = this;
  if (!name) return self;

  if (typeof name === 'string') {
    var input = self.inputs[name];
    if (input) input.set(value);
  } else {
    for (var k in name) {
      self.set(k, name[k]);
    }
  }

  return self;
};

/**
 * Configure the form options
 */

Form.prototype.configure = function(name, value) {
  var self = this;
  // TODO
  return self;
};

/**
 * Reset the form
 */

Form.prototype.reset = function() {
  var self = this;
  for (var k in self.inputs) {
    self.inputs[k]._reset();
  }
  self.emit('reset');
  return self;
};

/**
 * Destroy the form
 */

Form.prototype.destroy = function() {
  var self = this;
  for (var k in self.inputs) {
    self.inputs[k]._destroy();
  }
  self.emit('destroy');
  self.removeAllListeners();
  return self;
};
