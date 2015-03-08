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

/**
 * Common Defaults
 */
var defaults = {
	templateRoot: 'string',
	customFiltersPath: false,
	customTagsPath: []
};


/**
 * Nunjucks Render String
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
		engine.nunjucks.renderString(src, options, function(err, response){
			if(err){
				callback(logError(err, options));
				return;
			}

			callback(null, response, '.html');

		});
	} catch(ex) {
		callback(ex, null);
	}
};

/**
 * Renders a nunjuck tempalte file
 * 
 * @param  {String} `filepath`
 * @param  {Object|Function} `options` or callback function
 * @param  {Function} callback
 * @return {[type]} null
 * @api public
 */
engine.renderFile = function renderFile(filepath, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options = extend({}, defaults, options);
	try {
		engine.nunjucks.render(filepath, options, function (err, response) {
			if(err){
				callback(logError(err, options), null);
				return;
			}
			callback(null, response);
		});
	} catch (err) {
		callback(logError(err, options));
		return;
	}
};


/**
 * Configure Nunjucks
 * 
 * @param  {String} `relativeRootPath` Relative path to template root directory
 * @api public
 */
engine.configure = function(relativeRootPath){
	engine.nunjucks = new nunjucks.Environment(new nunjucks.FileSystemLoader(relativeRootPath));
}


/**
 * Add a global value that will be available to all templates. Note: this will overwrite any existing global called name.
 * 
 * @param  {String} `name`
 * @return {String|Object|Array|Function|Number} `value`
 * @api public
 */
engine.addGlobal = function(name, value) {
	engine.nunjucks.addGlobal(name, value);
};

/**
 * Add a template tag
 * 
 * @param  {String} `name`
 * @return {Function} `fn`
 * @api public
 */
engine.addTag = function(name, fn) {
	engine.nunjucks.addExtension(name, fn);
};


/**
 * Add a filter function
 * 
 * @param  {String} `name`
 * @return {Function} `fn`
 * @api public
 */
engine.addFilter = function(name, fn) {
	engine.nunjucks.addFilter(name, fn);
};

module.exports = engine;

/**
 * Helper function
 * 
 * @api private
 */

function logError(err, options) {
  err.message = err.message
    + ' in file: ' + err.filename
    + ' line no: ' + err.line;

  if (options.silent !== true) {
    console.log(chalk.red('%j'), err);
  }
  return err;
}