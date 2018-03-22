import Config, { MemoryStrategy } from './index';

describe('Config', () => {
  test('Memory strategy', () => {
    const config = new Config(Config.strategies.get('memory'));

    expect(config.strategy instanceof MemoryStrategy).toBe(true);
  });

  test('Set / Get', () => {
    const config = new Config(Config.strategies.get('memory'));

    config.set('env', 'test');
    config.set('foo.bar', 'foo');

    expect(config.get('env')).toBe('test');
    expect(config.get('foo.bar')).toBe('foo');

    expect(config.strategy.source).toEqual({
      env: 'test',
      foo: {
        bar: 'foo',
      },
    });
  });
});
