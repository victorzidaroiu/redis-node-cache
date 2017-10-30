'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _helpers = require('helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype);

var _class = function () {
  function _class() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _class);

    this.retryInterval = config.retryInterval || 500;
    this.prefix = config.prefix || 'jscache_';
    this.logger = config.logger || function () {};
    this.redisUrl = config.redisUrl;

    if (!this.redisUrl) {
      throw new Error('The redisUrl option is not set.');
    }

    this.client = _redis2.default.createClient({
      url: this.redisUrl,
      retry_strategy: function retry_strategy(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          _this.logger('redisNodeCache: Could not connect, retrying in ' + _this.retryInterval + ' ms...');
        }

        return _this.retryInterval;
      }
    });
  }

  _createClass(_class, [{
    key: 'get',
    value: function get(key) {
      if (this.client.connected) {
        return this.client.getAsync(this.prefix + (0, _helpers.hash)(key));
      }

      return Promise.reject('redisNodeCache: Not connected to the redis server.');
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      var expires = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (this.client.connected) {
        return this.client.setAsync([this.prefix + (0, _helpers.hash)(key), value, 'PX', expires]);
      }

      return Promise.reject('redisNodeCache: Not connected to the redis server.');
    }
  }, {
    key: 'connected',
    get: function get() {
      return this.client.connected;
    }
  }]);

  return _class;
}();

exports.default = _class;