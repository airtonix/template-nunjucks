/*!
 * engine-less <https://github.com/jonschlinkert/engine-less>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var assemble = require('assemble');
var verb = require('verb');
var engine = require('..');


var data = {thing: [1,2,3]};
var expected = '123';
var str = '{% for item in thing %}{{item}}{% endfor %}';
var templateFilePath = 'index.html';

beforeEach(function(done){
  engine.configure('test/fixtures');
  done();
})

describe('.render()', function() {


  it('should process a Nunjucks string.', function(done) {
    engine.render(str, data, function (err, html) {
      should.not.exist(err);
      html.should.equal(expected);
      done();
    });
  });

});

describe('.renderFile()', function() {
  it('should process a Nunjucks file.', function(done) {
    engine.renderFile(templateFilePath, data, function (err, html) {
      should.not.exist(err);
      html.should.equal(expected);
      done();
    });
  });
});

describe('verb usage', function() {
  it('should work with verb', function(done) {
    verb.engine('nunjucks', require('..'));
    // this isn't necessary, but it's more semantic than using `verb.page()`
    verb.create('page', {isRenderable: true});
    verb.data(data);
    verb.pages('test/fixtures/index.html');
    verb.render('index.html', data, function(err, html) {
      should.not.exist(err);
      console.log(html)
      // html.should.equal(expected);
      done();
    });
  });
});