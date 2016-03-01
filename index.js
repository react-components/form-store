/**
 * Module dependencies
 */

var Emitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var Form = require('./lib/form');

/**
 * Expose the FormStore
 */

exports = module.exports = FormStore;
exports['default'] = exports;

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

function FormStore(client) {
  Emitter.call(this);
  this.global = {};
  this._client = client;
}
inherits(FormStore, Emitter);

/**
 * Create a form from a descriptor
 */

FormStore.prototype.create = function(formObj, name) {
  var global = this.global;
  if (name && global[name]) return global[name];
  var form = new Form(formObj, this._client, name);

  form.on('rename', function(newName) {
    if (!newName) delete global[newName];
    else global[newName] = form;
  });

  if (name) {
    global[name] = form;
    form.on('destroy', function() {
      delete global[form.name];
    });
  }
  return form;
};
