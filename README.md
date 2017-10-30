# Redis Node Cache

***

This is a simple redis cache that supports key expiration, auto reconnection to the redis server and various options (see bellow).

## Requirements

- Redis
- Node

## Getting started

- Install the package:  

  ```
    npm i -S redis-node-cache
  ```

- Start your local redis server (if needed):

  ```
    redis-server
  ```

- Import it to your project:

  ```
  import RedisNodeCache from 'redis-node-cache';

  const cache = new RedisNodeCache(options);
  ```

## Options

- `redisUrl` The redis url to connect to (e.g.: redis://localhost:6379). Required.
- `reconnectInterval` Reconnect interval when the redis server is unavailable. Default: 500 ms. Optional.
- `prefix` Prefix for the redis keys. Default: "jscache_". Optional.
- `timeout` The timeout for getting and setting values. Default 100. Optional.
- `logger` Logger function that will be used to record debug messages. Optional.

## API

- `.set(key, value)` Set a value in the cache. Returns a promise that either resolves to the value or throws an error.

- `.get(key)` Get a value from the cache. Returns a promise that either resolves to the value or throws an error.

## Examples

- #### Connecting to the redis server

  ```
    import RedisNodeCache from 'redis-node-cache';

    const cache = new RedisNodeCache({
      redisUrl: 'redis://localhost:6379'
    });
  ```

- #### Setting a value in the cache

  ```
    cache.set('test-key', '10');
  ```

- #### Getting a value from the cache

  ```
    const value = await redisCache.get('test-key'); //10
  ```
