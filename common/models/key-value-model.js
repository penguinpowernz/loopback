var g = require('strong-globalize')();

/**
 * Data model for key-value databases.
 *
 * @class KeyValueModel
 * @inherits {Model}
 */

module.exports = function(KeyValueModel) {
  /**
   * Return the value for a given key.
   *
   * @param {String} key The key to use when searching.
   * @options {Object} options
   * @property
   * @callback {Function} callback The function to execute upon completion.
   * @param {Error} err The error object
   * @promise
   */
  KeyValueModel.get = function(key, options, callback) {
    throwNotAttached(this.modelName, 'get');
  };

  /**
   * Persist a value using a given key.
   *
   * @param {String} key The key to use when searching.
   * @param {Any} value The value to persist.
   * @options {Object} options
   * @property
   * @callback {Function} callback The function to execute upon completion.
   * @promise
   */
  KeyValueModel.set = function(key, value, options, callback) {
    throwNotAttached(this.modelName, 'set');
  };

  /**
   * Persist the TTL (time to live) for a given key. TTL is the remaining
   * time before a key/value pair is discarded from the database.
   *
   * @param {String} key The key to use when searching.
   * @param {Number} ttl The TTL (in milliseconds) to set for the key.
   * @options {Object} options
   * @property
   * @callback {Function} callback The function to execute upon completion.
   * @promise
   */
  KeyValueModel.expire = function(key, ttl, options, callback) {
    throwNotAttached(this.modelName, 'expire');
  };

  /**
   * Return the TTL (time to live) for a given key. TTL is the remaining time
   * before a key/value pair is discarded from the database.
   *
   * @param {String} key The key to use when searching.
   * @options {Object} options
   * @property
   * @callback {Function} callback The function to execute upon completion.
   * @promise
   */
  KeyValueModel.ttl = function(key, options, callback) {
    throwNotAttached(this.modelName, 'ttl');
  };

  /**
   * Return all keys for a given filter.
   *
   * @param {Array of Strings} filter The key to use when searching.
   * @options {Object} options
   * @property
   * @callback {Function} callback The function to execute upon completion.
   * @promise
   */
  KeyValueModel.keys = function(filter, options, callback) {
    throwNotAttached(this.modelName, 'keys');
  };

  /*!
   * Iterate through all keys for a given filter.
   */
  KeyValueModel.iterateKeys = function(filter, options) {
    throwNotAttached(this.modelName, 'iterateKeys');
  };

  /*!
   * Set up the extended model.
   */
  KeyValueModel.setup = function() {
    KeyValueModel.base.setup.apply(this, arguments);

    this.remoteMethod('get', {
      accepts: {
        arg: 'key', type: 'string', required: true,
        http: { source: 'path' },
      },
      returns: { arg: 'value', type: 'any', root: true },
      http: { path: '/:key', verb: 'get' },
      rest: { after: convertNullToNotFoundError },
    });

    this.remoteMethod('set', {
      accepts: [
        { arg: 'key', type: 'string', required: true,
          http: { source: 'path' }},
        { arg: 'value', type: 'any', required: true,
          http: { source: 'body' }},
        { arg: 'ttl', type: 'number',
          http: { source: 'query' },
          description: 'time to live in milliseconds' },
      ],
      http: { path: '/:key', verb: 'put' },
    });

    this.remoteMethod('expire', {
      accepts: [
        { arg: 'key', type: 'string', required: true,
          http: { source: 'path' }},
        { arg: 'ttl', type: 'number', required: true,
          http: { source: 'form' }},
      ],
      http: { path: '/:key/expire', verb: 'put' },
    });

    this.remoteMethod('ttl', {
      accepts: {
        arg: 'key', type: 'string', required: true,
        http: { source: 'path' },
      },
      returns: { arg: 'value', type: 'any', root: true },
      http: { path: '/:key/ttl', verb: 'get' },
    });

    this.remoteMethod('keys', {
      accepts: {
        arg: 'filter', type: 'object', required: false,
        http: { source: 'query' },
      },
      returns: { arg: 'keys', type: ['string'], root: true },
      http: { path: '/keys', verb: 'get' },
    });
  };
};

function throwNotAttached(modelName, methodName) {
  throw new Error(g.f(
    'Cannot call %s.%s(). ' +
      'The %s method has not been setup. '  +
      'The {{KeyValueModel}} has not been correctly attached ' +
      'to a {{DataSource}}!',
    modelName, methodName, methodName));
}

function convertNullToNotFoundError(ctx, cb) {
  if (ctx.result !== null) return cb();

  var modelName = ctx.method.sharedClass.name;
  var id = ctx.getArgByName('id');
  var msg = g.f('Unknown "%s" {{key}} "%s".', modelName, id);
  var error = new Error(msg);
  error.statusCode = error.status = 404;
  error.code = 'KEY_NOT_FOUND';
  cb(error);
}
