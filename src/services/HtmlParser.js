const Logger = require("../utils/Logger");
const Validator = require("../utils/Validator");

/**
 * HTML Parser service that coordinates extraction strategies
 * Follows Dependency Inversion Principle - depends on abstractions (ExtractionStrategy)
 * @class HtmlParser
 */
class HtmlParser {
  /**
   * Creates an HtmlParser instance
   * @param {Array<ExtractionStrategy>} strategies - Array of extraction strategies
   * @param {Logger} logger - Logger instance
   */
  constructor(strategies = [], logger = new Logger()) {
    this.strategies = strategies;
    this.logger = logger;
  }

  /**
   * Parses HTML using available strategies
   * @param {string} html - HTML content to parse
   * @returns {Array<string>} Array of extracted characters
   * @throws {Error} If all strategies fail
   */
  async parse(html) {
    try {
      Validator.validateHtml(html);
      this.logger.info("Starting HTML parsing with multiple strategies...");

      let characters = [];
      let lastError = null;

      // Try each strategy until one succeeds
      for (const strategy of this.strategies) {
        try {
          this.logger.info(`Trying ${strategy.getName()}...`);
          characters = await strategy.extract(html);

          if (characters && characters.length > 0) {
            Validator.validateCharacters(characters);
            this.logger.success(
              `Successfully extracted ${
                characters.length
              } characters using ${strategy.getName()}`
            );
            return characters;
          }
        } catch (error) {
          lastError = error;
          this.logger.warn(`${strategy.getName()} failed: ${error.message}`);
        }
      }

      // All strategies failed
      throw new Error(
        `All extraction strategies failed. Last error: ${
          lastError?.message || "Unknown error"
        }`
      );
    } catch (error) {
      this.logger.error("HTML parsing failed", error);
      throw error;
    }
  }

  /**
   * Adds a new extraction strategy
   * @param {ExtractionStrategy} strategy - Strategy to add
   */
  addStrategy(strategy) {
    this.strategies.push(strategy);
    this.logger.debug(`Added strategy: ${strategy.getName()}`);
  }
}

module.exports = HtmlParser;
