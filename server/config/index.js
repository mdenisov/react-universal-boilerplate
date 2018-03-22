// import pkg from '../../package.json';
import _get from 'lodash/get';
import _set from 'lodash/set';

export class MemoryStrategy {
  static key = 'memory';

  constructor() {
    this.source = {};
  }

  set(path, value) {
    return _set(this.source, path, value);
  }

  get(path) {
    return _get(this.source, path, undefined);
  }
}

class Config {
  static strategies = new Map([
    ['memory', MemoryStrategy],
  ]);

  constructor(strategy) {
    if (!this.constructor.strategies.has(strategy)) {
      throw new Error(`Strategy ${strategy} is not supported.`);
    }

    const Strategy = this.constructor.strategies.get(strategy);

    this.strategy = new Strategy();
  }

  set(path, value) {
    return this.strategy.set(path, value);
  }

  get(path) {
    return this.strategy.get(path);
  }
}

// const config = {
//   env: process.env.NODE_ENV,
// };

export default Config;
