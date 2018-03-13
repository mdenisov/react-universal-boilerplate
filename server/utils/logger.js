const { format } = require('util');
const chalk = require('chalk');
const _isString = require('lodash/isString');
const _isPlainObject = require('lodash/isPlainObject');
const _isObject = require('lodash/isObject');
const _isUndefined = require('lodash/isUndefined');
const _isNull = require('lodash/isNull');
const _isError = require('lodash/isError');
const _isEmpty = require('lodash/isEmpty');
const _omit = require('lodash/omit');

const { env } = require('../config');

const levels = {
  debug: 'bgCyan',
  info: 'bgGreen',
  warning: 'bgYellow',
  error: 'bgRed',
  fatal: 'bgRed',
};

const allowedColors = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'blackBright',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright',
];

const tokens = ['%s', '%d', '%i', '%f', '%j', '%o', '%O', '%%'];

class Logger {
  static createLogger(namespace) {
    return new Logger({ namespace });
  }

  constructor(config = {}) {
    this.config = Object.assign({
      timestamp: true,
      showStack: false,
      namespace: '',
      namespaceColor: 'cyan',
    }, config);

    if (this.config.namespaceColor && !allowedColors.includes(this.config.namespaceColor)) {
      throw new Error(`Invalid color ${this.config.namespaceColor}, must be one of ${allowedColors.join(', ')}`);
    }

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
      const color = chalk[config.namespaceColor].bold;
      namespace = env === 'development'
        ? ` ${color(`${config.namespace}`)}`
        : ` ${config.namespace}`;
    }

    // chalk[bgColor(severity)].black('', message, '');

    const output = env === 'development'
      ? `${chalk[levels[level]].black('', level.toUpperCase(), '')}${namespace} ${message}`
      : ` ${level.toUpperCase()}${namespace} ${message}`;

    console.log(`${config.timestamp ? new Date().toISOString() : ''} ${output}`);

    // output the stack trace to the console for debugging
    if (config.showStack && meta.err && meta.err.stack) {
      console.log(JSON.stringify(meta.err.stack));
    }

    // if there was meta information then output it
    if (!_isEmpty(_omit(meta, ['level', 'err']))) {
      console.log(_omit(meta, ['level', 'err']));
    }
  }
}

Logger.levels = Object.keys(levels);

module.exports = Logger;
