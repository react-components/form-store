/**
 * Module dependencies
 */

var Emitter = require('component-emitter');
var Form = require('./lib/form');

/**
 * Expose the FormStore
 */

exports = module.exports = FormStore;

/**
 * Expose the Form constructor
 */

exports.Form = Form;

/**
 * Expose the Input constructor
 */

exports.Input = require('./lib/input');

/**
 * Create a form store
 */

function FormStore() {
  this._forms = {};
}
Emitter(FormStore.prototype);

/**
 * Get a form by id
 */

FormStore.prototype.get = function(name) {
  var self = this;
  var forms = self._forms;
  if (forms[name]) return forms[name];
  return forms[name] = new Form(name);
};

FormStore.prototype.register = function(name, config) {
  var self = this;
  var forms = self._forms;
  var form = forms[name];
  if (!form) {
    form = forms[name] = new Form(name);
    this.emit('form', form);
  }
  if (config) form.update(config);
  return form;
};

// TODO figure out deletion
