/*!
 * engine-less <https://github.com/jonschlinkert/engine-less>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
	path = require('path'),
	should = require('should'),
	assemble = require('assemble'),
	engine = require('..');


var data = {thing: [1,2,3]};
var expected = '123';
var inPath = path.join('test', 'fixtures')
var outPath = path.join('test', 'output')
var templateFilePath = path.join(inPath, 'index.html')
var str = fs.readFileSync(templateFilePath, 'utf-8')

beforeEach(function(done){
	engine.configure(inPath);
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
		engine.renderFile('index.html', data, function (err, html) {
			should.not.exist(err);
			html.should.equal(expected);
			done();
		});
	});
});

// describe('verb usage', function() {
//   it('should work with verb', function(done) {
//     verb.engine('nunjucks', engine);
//     verb.data(data);
//     verb.option('owner', 'test')

//     verb.create('page', {isRenderable: true});
//     verb.pages(templateFilePath);
//     verb.render('index.html', function(err, html) {
//       should.not.exist(err);
//       should.exist(html);
//       html.should.equal(expected);
//       done();
//     });
//   });
// });

describe('assemble usage', function() {
	var app;

	beforeEach(function(){
		app = assemble.init()
		app.engine('html', engine);
		app.data(data);
	})

	it('should work with assemble', function(done) {
		// this isn't necessary, but it's more semantic than using `verb.page()`

		app.task('default', function(){
			var instream = app.src('./test/fixtures/*.html'),
				outstream = app.dest(outPath);

			instream.pipe(outstream)
			outstream.on('error', done);

			outstream.on('data', function (file) {
				should.exist(file);
				should.exist(file.path);
				should.exist(file.contents);
				String(file.contents).should.equal(expected);
			});

			outstream.on('end', function () {
				fs.readFile(path.join(outPath, 'index.html'), function (err, contents) {
					should.not.exist(err);
					should.exist(contents);
					String(contents).should.equal(expected);
					done();
				});
			});

		})

		app.run('default');

	});
});
