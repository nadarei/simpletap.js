// Deps
global.extend = require('util')._extend;
global.chai = require('chai');
chai.should();

var env = require('./support/env');
global.testSuite = env.suite(['1.7', '1.8', '1.9', '1.10', '2.0'], myEnv);

function myEnv(jq) {
  return env({
    expose: ['jQuery', '$'],
    js: [ 'vendor/jquery-'+jq+'.js', 'simpletap.js' ]
  });
}
