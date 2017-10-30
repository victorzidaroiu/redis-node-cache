import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('Redis Cache', () => {
  let redisCache;
  let mockReturnedValue;
  let connected;

  beforeEach(() => {
    const { default: RedisNodeCache } = proxyquire('../../src/', {
      redis: {
        createClient: () => ({
          connected,
          getAsync: () => Promise.resolve(mockReturnedValue),
          setAsync: () => Promise.resolve(mockReturnedValue),
        }),
        RedisClient: {
          prototype: {},
        },
      } });

    redisCache = new RedisNodeCache({
      redisURL: 'redis://localhost:6379',
    });
  });

  context('when connected to the redis server', () => {
    before(() => {
      mockReturnedValue = 1000;
      connected = true;
    });

    after(() => {
      mockReturnedValue = null;
      connected = false;
    });

    it('sets a value', async () => {
      const returnedValue = await redisCache.set('test-key', mockReturnedValue);
      expect(returnedValue).to.eq(mockReturnedValue);
    });

    it('gets a value', async () => {
      const returnedValue = await redisCache.get('test-key', mockReturnedValue);
      expect(returnedValue).to.eq(mockReturnedValue);
    });
  });

  context('when not connected to the redis server', () => {
    before(() => {
      connected = false;
    });

    after(() => {
      connected = true;
    });

    it('will throw an error when setting a value in the cache', async () => {
      redisCache.set('test-key', mockReturnedValue).catch((e) => {
        expect(e).to.eq('redisNodeCache: Not connected to the redis server.');
      });
    });

    it('will throw an error when getting a value from the cache', async () => {
      redisCache.get('test-key', mockReturnedValue).catch((e) => {
        expect(e).to.eq('redisNodeCache: Not connected to the redis server.');
      });
    });
  });
});
