var _ = require('lodash'),
	fs = require('fs'),
	nunjucks = require('nunjucks'),
	utils = require('engine-utils'),
	extend = require('extend-shallow'),
	chalk = require('chalk');


/**
 * Nunjucks Support
 */
var engine = utils.fromStringRenderer('nunjucks');
var env = null;
var loader = null;

/**
 * Common Defaults
 */
var defaults = {
	root: './templates',
	filters: false,
	tags: false,
	destExt: '.html'
};

engine.options = defaults

/**
 * Configure Nunjucks
 * 
 * @param  {String} `relativeRootPath` Relative path to template root directory
 * @api public
 */
engine.configure = function(options){
	engine.options = _.merge({}, defaults, options)
	loader = new nunjucks.FileSystemLoader(engine.options.root);
	env = new nunjucks.Environment(loader);
}


/**
 * Express Support
 */
engine.__express = engine.renderFile;
	

/**
 * Add a global value that will be available to all templates. Note: this will overwrite any existing global called name.
 * 
 * @param  {String} `name`
 * @return {String|Object|Array|Function|Number} `value`
 * @api public
 */
engine.addGlobal = function(name, value) {
	env.addGlobal(name, value);
};

/**
 * Add a template tag
 * 
 * @param  {String} `name`
 * @return {Function} `fn`
 * @api public
 */
engine.addTag = function(name, fn) {
	env.addExtension(name, fn);
};


/**
 * Add a filter function
 * 
 * @param  {String} `name`
 * @return {Function} `fn`
 * @api public
 */
engine.addFilter = function(name, fn) {
	env.addFilter(name, fn);
};


/**
 * Async Nunjucks String Render
 *
 * ```js
 * var str = '{% for key, value in object %}[{{ key }}:{{ value }}]{% endfor %}'
 * var data = {'object': { 'foo': 'bar' }};
 * engine.render(str, data, function(err, html){
 * 	console.log(html);
 * 	//=> '[foo:bar]'
 * })
 * ```
 * 
 * @param  {String} `src`
 * @param  {Object|Function} `options` or callback function
 * @param  {Function} `callback`
 * @api public
 */
engine.render = function(src, options, callback) {

	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options = extend({}, defaults, options);
	try{
		env.renderString(src, options, callback);
	} catch(ex) {
		callback(ex, null);
		return;
	}
};


/**
 * Synchronously Nunjucks String Render.
 *
 * ```js
 * var engine = require('template-nunjucks');
 * engine.renderSync('{{ name }}', {name: 'Jon'});
 * //=> 'Jon'
 * ```
 * @param  {Object|Function} `str` The string to render or compiled function.
 * @param  {Object} `context`
 * @return {String} Rendered string.
 * @api public
 */

engine.renderSync = function(str, context) {
  context = context || {};
  try {
  	return env.renderString(str, context);
  } catch (err) {
    return err;
  }
};

/**
 * Async Nunjucks File Render
 * 
 * @param  {String} `filepath`
 * @param  {Object|Function} `options` or callback function
 * @param  {Function} callback
 * @return {[type]} null
 * @api public
 */
engine.renderFile = function(filepath, options, callback) {

	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options = extend({}, defaults, options);

	try {
		env.render(filepath, options, callback);
	} catch (err) {
		callback(err);
		return;
	}
};

module.exports = engine;

