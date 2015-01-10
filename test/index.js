/**
 * Module dependencies
 */

var mocha = require('mocha');
var should = require('should');
var FormStore = require('..');

describe('form-store', function() {
  var store;
  beforeEach(function() {
    store = new FormStore();
  });

  it('should accept a hyper form', function() {
    var form = store.get('my-form', {
      method: 'POST',
      action: 'https://example.com/users',
      input: {
        'first_name': {
          type: 'text',
          placeholder: 'First Name'
        },
        gender: {
          type: 'select',
          placeholder: 'Gender',
          options: [
            {
              value: 'male',
              text: 'Male'
            },
            {
              value: 'female',
              text: 'Female'
            }
          ]
        },
        bio: {
          type: 'textarea',
          placeholder: 'Bio'
        },
        _token: {
          type: 'hidden',
          value: 'token123'
        }
      }
    });

    console.log('' + form);
    for (var k in form.inputs) {
      console.log('  ' + form.inputs[k]);
    }
  });

  it('should work', function() {
    var form = store.get('my-form', {
      method: 'POST',
      action: 'http://example.com'
    });

    console.log('' + form);

    var config = {
      type: 'text',
      required: true,
      value: 'Foobar'
    };

    var input = form.input('first-name', config);

    console.log('' + input);

    input.set('Testing');

    console.log('' + input);

    console.log(input.get('required'));
  });
});
