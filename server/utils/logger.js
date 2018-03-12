const { format } = require('util');
const debug = require('debug'); // eslint-disable-line
const chalk = require('chalk');
const _isString = require('lodash/isString');
const _isPlainObject = require('lodash/isPlainObject');
const _isObject = require('lodash/isObject');
const _isUndefined = require('lodash/isUndefined');
const _isNull = require('lodash/isNull');
const _isError = require('lodash/isError');
const _isEmpty = require('lodash/isEmpty');
const _omit = require('lodash/omit');

// `debug` (the least serious)
// `info`
// `warning` (also aliased as `warn`)
// `error` (also aliased as `err`)
// `fatal` (the most serious)
const levels = {
  debug: 'cyan',
  info: 'green',
  warning: 'yellow',
  error: 'red',
  fatal: 'bgRed',
};

const allowedColors = [
  'green',
  'bgBlack',
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyan',
  'bgWhite',
  'bgBlackBright',
  'bgRedBright',
  'bgGreenBright',
  'bgYellowBright',
  'bgBlueBright',
  'bgMagentaBright',
  'bgCyanBright',
  'bgWhiteBright',
];

// these are known as "placeholder tokens", see this link for more info:
// <https://nodejs.org/api/util.html#util_util_format_format_args>
//
// since they aren't exposed (or don't seem to be) by node (at least not yet)
// we just define an array that contains them for now
// <https://github.com/nodejs/node/issues/17601>
const tokens = ['%s', '%d', '%i', '%f', '%j', '%o', '%O', '%%'];

class Logger {
  constructor(config = {}) {
    // debugName gets passed to logger.debug
    this.config = Object.assign({
      timestamp: true,
      appName: 'logger',
      showStack: false,
      silent: false,
      processName: null,
      processColor: 'green',
    }, config);

    if (
      this.config.processColor &&
      !allowedColors.includes(this.config.processColor)
    ) {
      throw new Error(`Invalid color ${this.config.processColor}, must be one of ${allowedColors.join(', ')}`);
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

  contextError(err) {
    this.error(err);
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

    // Suppress logs if it was silent
    if (config.silent) {
      return;
    }

    if (level === 'debug') {
      let name = config.processName;

      if (!name && require.main && require.main.filename) {
        name = require.main.filename;
      }

      if (!name) {
        name = 'logger';
      }

      const data = _omit(meta, 'level');

      debug(name)(message, _isEmpty(data) ? '' : data);
    } else {
      let prepend = '';
      if (config.processName) {
        const color = chalk[config.processColor].bold;
        prepend = `${color(`[${config.processName}]`)} `;
      }

      const output = `${prepend}${chalk[levels[level]](level)}: ${message}`;

      console.log(`${config.timestamp ? new Date().toISOString() : ''} ${output}`);

      // if there was meta information then output it
      if (!_isEmpty(_omit(meta, ['level', 'err']))) {
        console.log(_omit(meta, ['level', 'err']));
      }

      // if we're not showing the stack trace then return early
      if (!config.showStack) {
        return;
      }

      // output the stack trace to the console for debugging
      if (meta.err && meta.err.stack) {
        console.log(meta.err.stack);
      }
    }
  }
}

Logger.levels = Object.keys(levels);

module.exports = Logger;
