# Redis Node Cache

***

This is a simple redis cache that can set and get values from redis.
It supports key expiration, auto reconnection to the redis server and various options (see bellow).

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

- Import the package in your project:

  ```
  import RedisNodeCache from 'redis-node-cache';

  const cache = new RedisNodeCache(options);
  ```

## Options

- `redisUrl` The redis url to connect to (e.g.: redis://localhost:6379). Required.
- `reconnectInterval` Reconnection interval when the redis server is unavailable. Default: 500 ms. Optional.
- `prefix` Prefix for the redis keys. Default: "jscache_". Optional
- `logger` Logger function that will be used to record debug messages. Optional.

## API

- `.set(key, value, expires)` Set a value in the cache with an optional expires timeout in ms. Returns a promise that either resolves to "OK" or throws an error.

- `.get(key)` Get a value from the cache. Returns a promise that either resolves to the value (or null if it doesn't exist) or throws an error.

- `.connected` Returns true if connected to the redis server, false otherwise.

## Examples

- #### Connecting to the redis server

  ```
    import RedisNodeCache from 'redis-node-cache';

    const cache = new RedisNodeCache({
      redisUrl: 'redis://localhost:6379'
    });
  ```

- #### Setting a value in the cache for 30 min

  ```
  cache.set('key', 'a string value', 1000 * 60 * 30)
    .catch((e) => {
      ...
    });
  ```

- #### Getting a value from the cache

  ```
  cache.get('key')
    .then(value => {
      ...
    })
    .catch((e) => {
      ...
    });
  ```
