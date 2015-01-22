/**
 * Module dependencies
 */

var mocha = require('mocha');
var should = require('should');
var FormStore = require('..');
var qs = require('qs');

describe('form-store', function() {
  var store, client;
  beforeEach(function() {
    client = {
      submit: function(method, action, values, cb) {
        setTimeout(function() {
          cb(null, {success: true});
        }, 10);
      },
      format: function(method, action, values, cb) {
        var hasBody = method !== 'GET';
        cb(null, {
          method: method,
          action: action + (hasBody ? '' : '?' + qs.stringify(values)),
          body: hasBody ? values : undefined
        })
      }
    };
    store = new FormStore(client);
  });

  describe('#create', function() {
    it('should create a form from a description', function() {
      var form = store.create({
        method: 'POST',
        action: 'http://example.com',
        input: {
          name: {
            type: 'text',
            placeholder: 'Full name'
          }
        }
      });

      should.exist(form);
      form.method.should.eql('POST');
      form.action.should.eql('http://example.com');
      should.exist(form.inputs);
      should.exist(form.inputs.name);
    });
  });

  describe('Form', function() {
    describe('#update', function() {
      it('should update the configuration for the form', function() {
        var form = store.create({
          method: 'GET',
          action: 'http://example.com'
        });

        form.update({
          method: 'POST',
          input: {
            name: {
              type: 'text'
            }
          }
        });

        form.method.should.eql('POST');
        form.action.should.eql('http://example.com');
        should.exist(form.inputs.name);

        form.update({
          input: {}
        });

        should.not.exist(form.inputs.name);
      });
    });

    describe('#configure', function() {
      it('should configure silent options for non-existant inputs');
      it('should enable/disable validation');
    });

    describe('#set', function() {
      it('should set a value for an input', function() {
        var form = store.create({
          input: {
            name: {
              type: 'text'
            }
          }
        });

        form.set('name', 'Joe');

        form.values.name.should.eql('Joe');
        form.inputs.name.value.should.eql('Joe');
      });

      it('should fail silently when an input doesn\'t exist', function() {
        var form = store.create({

        });

        form.set('name', 'Robert');

        should.not.exist(form.values.name);
        should.not.exist(form.inputs.name);
      });
    });

    describe('#format', function() {
      it('should format a request', function(done) {
        var form = store.create({
          method: 'GET',
          action: 'http://example.com',
          input: {
            name: {
              type: 'text'
            }
          }
        });

        form.set('name', 'Mike')

        form.format(function(err, format) {
          format.method.should.eql('GET');
          format.action.should.eql('http://example.com?name=Mike');
          should.not.exist(format.body);
          done();
        })
      });
    });

    describe('#submit', function() {
      it('should submit a request', function(done) {
        var form = store.create({
          input: {
            name: {
              type: 'text'
            }
          }
        });

        form.set('name', 'Joe');

        form.submit(function(err, res) {
          should.exist(res);
          should.ok(res.success);
          done();
        });
      })
    });

    describe('#reset', function() {
      it('should reset all values and inputs for the form', function() {
        var form = store.create({
          input: {
            name: {
              type: 'text'
            }
          }
        });

        form.set('name', 'Robert');

        form.reset();

        should.not.exist(form.values.name);
        should.not.exist(form.inputs.name.value);
      });
    });

    describe('#destroy', function() {
      it('should clear all listeners in the form', function() {
        var form = store.create({
          input: {
            name: {
              type: 'text'
            }
          }
        });

        form.destroy();
      });
    });
  });

  describe('Input', function() {
    describe('#set', function() {
      it('should update the value for the input', function() {
        var input = store.create({
          input: {
            name: {
              type: 'text'
            }
          }
        }).inputs.name;

        input.set('Mike');

        input.value.should.eql('Mike');
      });

      it('should emit a "change" event', function(done) {
        var input = store.create({
          input: {
            name: {
              type: 'text'
            }
          }
        }).inputs.name;

        input.on('change', function(value) {
          value.should.eql('Robert');
          done();
        });

        input.set('Robert')
      });

      it('should mark the input as dirty', function() {
        var input = store.create({
          input: {
            name: {
              type: 'text'
            }
          }
        }).inputs.name;

        input.set('Joe');

        should.ok(input.isDirty);
      });
    });

    describe('#_reset', function() {
      it('should reset the input value', function() {
        var input = store.create({
          input: {
            name: {
              type: 'text'
            }
          }
        }).inputs.name;

        input.set('Cameron');

        input._reset();

        should.not.exist(input.value);
      });

      it('should preserve the original value', function() {
        var input = store.create({
          input: {
            name: {
              type: 'text',
              value: 'Robert'
            }
          }
        }).inputs.name;

        input.set('Joe');

        input._reset();

        input.value.should.eql('Robert');
      });
    });
  });
});
