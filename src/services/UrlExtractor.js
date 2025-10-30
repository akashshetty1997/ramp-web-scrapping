const Logger = require("../utils/Logger");
const Validator = require("../utils/Validator");
const HttpClient = require("./HttpClient");
const HtmlParser = require("./HtmlParser");

/**
 * Main URL Extractor service that orchestrates the entire extraction process
 * Follows Single Responsibility Principle - coordinates the extraction workflow
 * @class UrlExtractor
 */
class UrlExtractor {
  /**
   * Creates a UrlExtractor instance
   * @param {HttpClient} httpClient - HTTP client for fetching
   * @param {HtmlParser} htmlParser - HTML parser for extraction
   * @param {Logger} logger - Logger instance
   */
  constructor(httpClient, htmlParser, logger = new Logger()) {
    this.httpClient = httpClient;
    this.htmlParser = htmlParser;
    this.logger = logger;
  }

  /**
   * Extracts hidden URL from the challenge page
   * @param {string} challengeUrl - URL of the challenge page
   * @returns {Promise<Object>} Object containing url, flag, and characters
   * @throws {Error} If extraction fails
   */
  async extract(challengeUrl) {
    try {
      this.logger.info("=".repeat(60));
      this.logger.info("🚀 Starting URL extraction process...");
      this.logger.info("=".repeat(60));

      // Step 1: Fetch HTML
      const html = await this._fetchHtml(challengeUrl);

      // Step 2: Parse and extract characters
      const characters = await this._extractCharacters(html);

      // Step 3: Build URL
      const hiddenUrl = this._buildUrl(characters);

      // Step 4: Attempt to fetch flag
      const flag = await this._fetchFlag(hiddenUrl);

      // Return results
      const result = {
        url: hiddenUrl,
        flag: flag,
        characters: characters,
        characterCount: characters.length,
      };

      this._displayResults(result);
      return result;
    } catch (error) {
      this.logger.error("URL extraction failed", error);
      throw error;
    }
  }

  /**
   * Fetches HTML from challenge URL
   * @private
   * @param {string} url - URL to fetch
   * @returns {Promise<string>} HTML content
   */
  async _fetchHtml(url) {
    this.logger.info("📥 Step 1: Fetching HTML...");

    try {
      const html = await this.httpClient.fetch(url);
      this.logger.success(`HTML fetched: ${html.length} characters`);
      return html;
    } catch (error) {
      throw new Error(`Failed to fetch HTML: ${error.message}`);
    }
  }

  /**
   * Extracts characters from HTML
   * @private
   * @param {string} html - HTML content
   * @returns {Promise<Array>} Extracted characters
   */
  async _extractCharacters(html) {
    this.logger.info("🔍 Step 2: Extracting characters...");

    try {
      const characters = await this.htmlParser.parse(html);
      this.logger.success(`Extracted ${characters.length} characters`);
      return characters;
    } catch (error) {
      throw new Error(`Failed to extract characters: ${error.message}`);
    }
  }

  /**
   * Builds URL from extracted characters
   * @private
   * @param {Array} characters - Array of characters
   * @returns {string} Built URL
   */
  _buildUrl(characters) {
    this.logger.info("🔧 Step 3: Building URL...");

    try {
      const url = characters.join("");
      Validator.validateUrl(url);
      this.logger.success(`URL built: ${url}`);
      return url;
    } catch (error) {
      // If not a valid URL, return the string anyway
      const url = characters.join("");
      this.logger.warn(`Built string may not be a valid URL: ${url}`);
      return url;
    }
  }

  /**
   * Attempts to fetch the flag from hidden URL
   * @private
   * @param {string} url - Hidden URL
   * @returns {Promise<string>} Flag or null
   */
  async _fetchFlag(url) {
    this.logger.info("🏁 Step 4: Fetching flag...");

    try {
      const response = await this.httpClient.fetch(url);
      // Extract text content (remove HTML tags)
      const flag = response.replace(/<[^>]*>/g, "").trim();
      this.logger.success(`Flag retrieved: ${flag}`);
      return flag;
    } catch (error) {
      this.logger.warn(`Could not fetch flag automatically: ${error.message}`);
      this.logger.info(
        "Please open the URL manually in your browser to get the flag"
      );
      return null;
    }
  }

  /**
   * Displays extraction results
   * @private
   * @param {Object} result - Extraction results
   */
  _displayResults(result) {
    this.logger.info("");
    this.logger.info("=".repeat(60));
    this.logger.success("🎉 EXTRACTION COMPLETE!");
    this.logger.info("=".repeat(60));
    this.logger.info(`📎 Hidden URL: ${result.url}`);
    if (result.flag) {
      this.logger.info(`🚩 Flag: ${result.flag}`);
    }
    this.logger.info(`📊 Total characters: ${result.characterCount}`);
    this.logger.info("=".repeat(60));
  }
}

module.exports = UrlExtractor;
