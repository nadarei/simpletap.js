// Deps
global.extend = require('util')._extend;
global.chai = require('chai');
chai.should();

// Helpers
global.testSuite = testSuite;

var jsdom = require('jsdom');

function testSuite(name, fn) {
  ['1.7', '1.8', '1.9', '1.10', '2.0'].forEach(function(jq) {
    describe('jQuery '+jq+' '+name, function() {
      beforeEach(env(jq));
      fn.apply(this, []);
    });
  });
}

function env(jq) {
  return function(done) {
    jsdom.env({
      html: '',
      src: [
        getFile('../vendor/jquery-'+jq+'.js'),
        getFile('../simpletap.js')
      ],
      done: function(errors, window) {
        window.console = console;
        extend(global, {
          jQuery : window.jQuery,
          $      : window.$,
          window : window
        });
        done(errors);
      }
    });
  };
}

function getFile(filepath) {
  var path = require('path');
  var fs = require('fs');
  return require('fs').readFileSync(path.resolve(__dirname, filepath)).toString();
}
