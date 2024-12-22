
import fs from 'fs'
import path from 'path'
import * as util from 'util'
import winston from 'winston'
import config from '../configs/app.config'

const { combine, timestamp, label, printf, colorize } = winston.format

const logDir = 'logs'

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const transports = [
  new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', handleExceptions: true }),
  new winston.transports.File({ filename: path.join(logDir, 'combined.log'), handleExceptions: true })
]

// if (config.get('env') !== 'production') {
transports.push(new winston.transports.Console({
  handleExceptions: true
}))
// }

const customFormat = printf((info) => {
  let msg = `Process: ${process.pid} ${info.timestamp} [${info.label}] ${info.level}: `
  info = typeof info.message === 'object' ? info.message : info

  msg += info.logTitle ? `${info.logTitle} Message: ${info.message || 'No Message'} ` : info.message || 'No Message '
  msg += info.class ? `class: ${typeof info.class === 'object' ? util.inspect(info.class) : info.class} ` : ''
  msg += info.context ? `context: ${typeof info.context === 'object' ? util.inspect(info.context) : info.context} ` : ''
  msg += info.metadata ? `metadata: ${typeof info.metadata === 'object' ? util.inspect(info.metadata) : info.metadata} ` : ''
  msg += info.exceptionBacktrace ? `exceptionBacktrace: ${typeof info.exceptionBacktrace === 'object' ? util.inspect(info.exceptionBacktrace) : info.exceptionBacktrace} ` : ''
  msg += info.fault ? `fault: ${typeof info.fault === 'object' ? util.inspect(info.fault) : info.fault} ` : ''
  return msg
})

const format = combine(
  colorize(),
  label({ label: config.get('app.name') }),
  timestamp(),
  customFormat
)

const winstonLogger = winston.createLogger({ level: config.get('log_level') || 'info', transports: transports, exitOnError: false, format })

/**
 * @typedef {Object} LogArgHash with message and other properties
 * @property {string} wrap to wrap the log message
 * @property {(Object | number | string)} klass name of the class or constructor
 * @property {(Object | number | string)} message message to log
 * @property {(Object | number | string)} context context of the log
 * @property {(Object | number | string)} metadata extra metadata for the log
 * @property {(Object | number | string)} exception exception for the log
 * @property {(Object | number | string)} fault fault for the log
 */

/**
 * @class Logger
 *
 * @classdesc class which utilizes winston instance
 * for logging things to console and filesystem
 *
 * @hideconstructor
 */
class Logger {
  /**
   *
   * @static
   * @public
   * @function
   * @param {string} logTitle title of the Log
   * @param {LogArgHash} [argHash={}] object with message and other properties
   * @returns {undefined}
   */
  static info (logTitle, argHash = {}) {
    this.#log('info', logTitle, argHash)
  }

  /**
   *
   * @static
   * @function
   * @public
   * @param {string} logTitle title of the Log
   * @param {LogArgHash} [argHash={}] object with message and other properties
   * @returns {undefined}
   */
  static debug (logTitle, argHash = {}) {
    this.#log('debug', logTitle, argHash)
  }

  /**
   *
   * @static
   * @function
   * @public
   * @param {string} logTitle title of the Log
   * @param {LogArgHash} [argHash={}] object with message and other properties
   * @returns {undefined}
   */
  static error (logTitle, argHash = {}) {
    this.#log('error', logTitle, argHash)
  }

  /**
   *
   * @static
   * @function
   * @private
   * @param {string} logType type of the Log error, info, debug
   * @param {string} logTitle title of the Log
   * @param {LogArgHash} [argHash={}] object with message and other properties
   * @returns {undefined}
   */
  static #log (logType, logTitle, argHash = {}) {
    const allArgs = Object.assign({ logTitle }, argHash)
    const logMessage = this.#buildMessage(allArgs)
    this.#writeToLog(logType, logTitle, logMessage, argHash)
  }

  /**
   *
   * @static
   * @function
   * @private
   * @param {string} logType type of the Log error, info, debug
   * @param {string} logTitle title of the Log
   * @param {(string| object)} logTitle Title of the Log
   * @param {LogArgHash} [argHash={}] object with message and other properties
   * @returns {undefined}
   */
  static #writeToLog (logType, logTitle, logMessage, argHash = {}) {
    if (argHash && argHash.wrap === 'start') {
      winstonLogger[logType](this.#generateWrapStr(logTitle, 'START'))
    } else if (argHash && argHash.wrap === 'end') {
      winstonLogger[logType](this.#generateWrapStr(logTitle, 'END'))
    } else {
      winstonLogger[logType](logMessage)
    }
  }

  /**
   *
   * @static
   * @function
   * @private
   * @param {string} logTitle title of the Log
   * @param {string} wrapWord Wrapping word
   * @returns {string}
   */
  static #generateWrapStr (logTitle, wrapWord) {
    return `${wrapWord}${'='.repeat(15)}${logTitle.toUpperCase()}${'='.repeat(15)}${wrapWord}`
  }

  /**
   *
   * @static
   * @function
   * @private
   * @param {LogArgHash} logAttrs object with message and other properties
   * @returns {Object}
   */
  static #buildMessage (logAttrs) {
    const msg = { logTitle: logAttrs.logTitle }
    if (logAttrs.klass) { msg.class = logAttrs.klass.name }
    if (logAttrs.message) { msg.message = logAttrs.message }
    if (logAttrs.context) { msg.context = logAttrs.context }
    if (logAttrs.metadata) { msg.metadata = logAttrs.metadata }
    if (logAttrs.exception) { msg.exceptionBacktrace = logAttrs.exception.stack }
    if (logAttrs.fault) { msg.fault = logAttrs.fault }
    return msg
  }
}

export default Logger
