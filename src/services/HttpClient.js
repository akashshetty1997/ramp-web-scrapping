const https = require("https");
const Logger = require("../utils/Logger");
const Validator = require("../utils/Validator");
const { HTTP } = require("../config/constants");

/**
 * HTTP Client for making requests
 * Follows Single Responsibility Principle - only handles HTTP requests
 * @class HttpClient
 */
class HttpClient {
  /**
   * Creates an HttpClient instance
   * @param {Logger} logger - Logger instance for logging
   */
  constructor(logger = new Logger()) {
    this.logger = logger;
    this.timeout = HTTP.TIMEOUT;
    this.maxRetries = HTTP.MAX_RETRIES;
    this.retryDelay = HTTP.RETRY_DELAY;
  }

  /**
   * Fetches content from a URL with retry logic
   * @param {string} url - URL to fetch
   * @param {number} [retryCount=0] - Current retry attempt
   * @returns {Promise<string>} HTML content
   * @throws {Error} If fetch fails after all retries
   */
  async fetch(url, retryCount = 0) {
    try {
      Validator.validateUrl(url);
      this.logger.info(
        `Fetching URL: ${url} (Attempt ${retryCount + 1}/${this.maxRetries})`
      );

      const html = await this._makeRequest(url);
      Validator.validateHtml(html);

      this.logger.success(`Successfully fetched ${html.length} characters`);
      return html;
    } catch (error) {
      this.logger.error(`Fetch attempt ${retryCount + 1} failed`, error);

      if (retryCount < this.maxRetries - 1) {
        this.logger.info(`Retrying in ${this.retryDelay}ms...`);
        await this._delay(this.retryDelay);
        return this.fetch(url, retryCount + 1);
      }

      throw new Error(
        `Failed to fetch URL after ${this.maxRetries} attempts: ${error.message}`
      );
    }
  }

  /**
   * Makes an HTTP GET request
   * @private
   * @param {string} url - URL to request
   * @returns {Promise<string>} Response body
   */
  _makeRequest(url) {
    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        let data = "";

        // Set encoding
        response.setEncoding("utf8");

        // Collect data chunks
        response.on("data", (chunk) => {
          data += chunk;
        });

        // Resolve when complete
        response.on("end", () => {
          if (response.statusCode !== 200) {
            reject(
              new Error(
                `HTTP ${response.statusCode}: ${response.statusMessage}`
              )
            );
          } else {
            resolve(data);
          }
        });
      });

      // Set timeout
      request.setTimeout(this.timeout, () => {
        request.destroy();
        reject(new Error("Request timeout"));
      });

      // Handle errors
      request.on("error", (error) => {
        reject(error);
      });
    });
  }

  /**
   * Delays execution for specified milliseconds
   * @private
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = HttpClient;
