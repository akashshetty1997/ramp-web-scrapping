/**
 * Logger utility class for consistent logging across the application
 * Follows Single Responsibility Principle - only handles logging
 * @class Logger
 */
class Logger {
  /**
   * Creates a Logger instance
   * @param {string} level - Logging level (ERROR, WARN, INFO, DEBUG)
   */
  constructor(level = "INFO") {
    this.level = level;
    this.levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3,
    };
  }

  /**
   * Logs an error message
   * @param {string} message - Error message to log
   * @param {Error} [error] - Optional error object
   */
  error(message, error = null) {
    if (this._shouldLog("ERROR")) {
      console.error(`❌ [ERROR] ${message}`);
      if (error && error.stack) {
        console.error(error.stack);
      }
    }
  }

  /**
   * Logs a warning message
   * @param {string} message - Warning message to log
   */
  warn(message) {
    if (this._shouldLog("WARN")) {
      console.warn(`⚠️  [WARN] ${message}`);
    }
  }

  /**
   * Logs an info message
   * @param {string} message - Info message to log
   */
  info(message) {
    if (this._shouldLog("INFO")) {
      console.log(`ℹ️  [INFO] ${message}`);
    }
  }

  /**
   * Logs a debug message
   * @param {string} message - Debug message to log
   * @param {*} [data] - Optional data to log
   */
  debug(message, data = null) {
    if (this._shouldLog("DEBUG")) {
      console.log(`🔍 [DEBUG] ${message}`);
      if (data) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }

  /**
   * Logs a success message
   * @param {string} message - Success message to log
   */
  success(message) {
    console.log(`✅ [SUCCESS] ${message}`);
  }

  /**
   * Determines if a message should be logged based on current level
   * @private
   * @param {string} messageLevel - Level of the message
   * @returns {boolean} Whether to log the message
   */
  _shouldLog(messageLevel) {
    return this.levels[messageLevel] <= this.levels[this.level];
  }
}

module.exports = Logger;
