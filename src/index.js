import redis from 'redis';
import bluebird from 'bluebird';
import { hash } from 'helpers';

bluebird.promisifyAll(redis.RedisClient.prototype);

export default class {
  constructor(config = {}) {
    this.retryInterval = config.retryInterval || 500;
    this.prefix = config.prefix || 'jscache_';
    this.timeout = config.timeout || 100;
    this.logger = config.logger || (() => {});
    this.redisUrl = config.redisUrl;

    if (!this.redisUrl) {
      throw new Error('The redisUrl option is not set.');
    }

    this.client = redis.createClient({
      url: this.redisUrl,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          this.logger(`redisNodeCache: Could not connect, retrying in ${this.retryInterval} ms...`);
        }

        return this.retryInterval;
      },
    });
  }

  get connected() {
    return this.client.connected;
  }

  get(key) {
    if (this.client.connected) {
      return this.client.getAsync(this.prefix + hash(key));
    }

    return Promise.reject('redisNodeCache: Not connected to the redis server.');
  }

  set(key, response) {
    if (this.client.connected) {
      return this.client.setAsync([this.prefix + hash(key), response, 'PX', this.timeout]);
    }

    return Promise.reject('redisNodeCache: Not connected to the redis server.');
  }
}
