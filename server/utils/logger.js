const { format } = require('util');
const chalk = require('chalk');
const colorConvert = require('color-convert'); // eslint-disable-line
const _isString = require('lodash/isString');
const _isPlainObject = require('lodash/isPlainObject');
const _isObject = require('lodash/isObject');
const _isUndefined = require('lodash/isUndefined');
const _isNull = require('lodash/isNull');
const _isError = require('lodash/isError');
const _isEmpty = require('lodash/isEmpty');
const _omit = require('lodash/omit');

const IS_DEV = process.env.NODE_ENV === 'development';

// `debug` (the least serious)
// `info`
// `warning` (also aliased as `warn`)
// `error` (also aliased as `err`)
// `fatal` (the most serious)
const levels = {
  debug: 'bgCyan',
  info: 'bgGreen',
  warning: 'bgYellow',
  error: 'bgRed',
  fatal: 'bgRed',
};

const tokens = ['%s', '%d', '%i', '%f', '%j', '%o', '%O', '%%'];

const colors = [
  20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
  69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
  135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
  172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
  205, 206, 207, 208, 209, 214, 215, 220, 221,
];

class Logger {
  /**
   * Fabric method
   * @param namespace
   * @returns {Logger}
   */
  static create(namespace) {
    return new Logger({ namespace });
  }

  /**
   * Get ansi color for namespace
   * @param text
   * @returns {*}
   */
  static getRGBColor(text) {
    let hash = 0;

    [...text].forEach((i) => {
      hash = ((hash << 5) - hash) + text.charCodeAt(i); // eslint-disable-line
      // Convert to 32bit integer
      hash |= 0; // eslint-disable-line
    });

    const code = colors[Math.abs(hash) % colors.length];

    return colorConvert.ansi256.rgb(code);
  }

  constructor(config = {}) {
    this.config = Object.assign({
      timestamp: false,
      showStack: false,
      namespace: '',
    }, config);

    // bind helper functions for each log level
    Object.keys(levels).forEach((level) => {
      this[level] = (...args) => {
        this.log(level, ...args);
      };
    });

    // aliases
    this.err = this.error;
    this.warn = this.warning;
  }

  /**
   * Main logging method
   * @param level
   * @param message
   * @param meta
   */
  log(level, message, meta = {}) {
    const { config } = this;
    let modifier = 0;

    if (level === 'warn') {
      level = 'warning'; // eslint-disable-line
    }

    if (level === 'err') {
      level = 'error'; // eslint-disable-line
    }

    if (!_isString(level) || !(Object.keys(levels).includes(level))) {
      meta = message; // eslint-disable-line
      message = level; // eslint-disable-line
      level = 'info'; // eslint-disable-line
      modifier = -1;
    }

    // if there are four or more args
    // then infer to use util.format on everything
    if (arguments.length >= 4 + modifier) {
      message = format(...[...arguments].slice(1 + modifier)); // eslint-disable-line
      meta = {}; // eslint-disable-line
    } else if (
      arguments.length === 3 + modifier &&
      _isString(message) &&
      tokens.some(t => message.includes(t))
    ) {
      // otherwise if there are three args and if the `message` contains
      // a placeholder token (e.g. '%s' or '%d' - see above `tokens` variable)
      // then we can infer that the `meta` arg passed is used for formatting
      message = format(message, meta); // eslint-disable-line
      meta = {}; // eslint-disable-line
    } else if (
      !_isPlainObject(meta) &&
      !_isUndefined(meta) &&
      !_isNull(meta)
    ) {
      // if the `meta` variable passed was not an Object then convert it
      message = format(message, meta); // eslint-disable-line
      meta = {}; // eslint-disable-line
    } else if (!_isString(message)) {
      // if the message is not a string then we should run `util.format` on it
      // assuming we're formatting it like it was another argument
      // (as opposed to using something like fast-json-stringify)
      message = format(message); // eslint-disable-line
    }

    if (!_isPlainObject(meta)) {
      meta = {}; // eslint-disable-line
    }

    if (_isError(message)) {
      if (!_isObject(meta.err)) {
        meta.err = { stack: message.stack, message: message.message }; // eslint-disable-line
      }

      message = message.message; // eslint-disable-line
    }

    // set default level on meta
    meta.level = level; // eslint-disable-line

    let namespace = '';

    if (config.namespace) {
      const rgb = this.constructor.getRGBColor(config.namespace);
      const colored = chalk.bold.rgb(...rgb)(config.namespace);

      namespace = IS_DEV
        ? `${colored} `
        : `${config.namespace} `;
    }

    const date = config.timestamp ? `${new Date().toISOString()} ` : '';
    const output = IS_DEV
      ? `${chalk[levels[level]].black('', level.toUpperCase(), '')} ${namespace}${message}`
      : `[${level.toUpperCase()}] ${namespace}${JSON.stringify(message)}`;

    console.log(`${date}${output}`);

    // output the stack trace to the console for debugging
    if (config.showStack && meta.err && meta.err.stack) {
      console.log(JSON.stringify(meta.err.stack));
    }

    // if there was meta information then output it
    if (!_isEmpty(_omit(meta, ['level', 'err']))) {
      console.log(JSON.stringify(_omit(meta, ['level', 'err'])));
    }
  }
}

Logger.levels = Object.keys(levels);

module.exports = Logger;
