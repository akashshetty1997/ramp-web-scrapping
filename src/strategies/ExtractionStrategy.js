/**
 * Abstract base class for extraction strategies
 * Follows Open/Closed Principle - open for extension, closed for modification
 * @abstract
 * @class ExtractionStrategy
 */
class ExtractionStrategy {
  /**
   * Creates an ExtractionStrategy instance
   * @param {Logger} logger - Logger instance
   */
  constructor(logger) {
    if (new.target === ExtractionStrategy) {
      throw new Error(
        "ExtractionStrategy is an abstract class and cannot be instantiated directly"
      );
    }
    this.logger = logger;
  }

  /**
   * Extracts characters from HTML content
   * @abstract
   * @param {string} html - HTML content to parse
   * @returns {Array<string>} Array of extracted characters
   * @throws {Error} Must be implemented by subclass
   */
  extract(html) {
    throw new Error("extract() method must be implemented by subclass");
  }

  /**
   * Gets the strategy name
   * @abstract
   * @returns {string} Strategy name
   */
  getName() {
    throw new Error("getName() method must be implemented by subclass");
  }
}

module.exports = ExtractionStrategy;
