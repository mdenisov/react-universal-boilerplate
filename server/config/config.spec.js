import Config, { MemoryStrategy } from './index';

const config = new Config(Config.strategies.get('memory'));

describe('Config', () => {
  test('Memory strategy', () => {
    expect(config.strategy instanceof MemoryStrategy).toBe(true);
  });

  test('Set / Get', () => {
    config.set('env', 'test');
    config.set('foo.bar', 'foo');

    expect(config.get('env')).toBe('test');
    expect(config.get('foo.bar')).toBe('foo');
  });

  test('toJSON', () => {
    expect(config.toJSON()).toEqual({
      env: 'test',
      foo: {
        bar: 'foo',
      },
    });
  });
});
