const ExtractionStrategy = require("./ExtractionStrategy");
const { PATTERN } = require("../config/constants");

/**
 * Regex-based extraction strategy (fallback)
 * @class RegexStrategy
 * @extends ExtractionStrategy
 */
class RegexStrategy extends ExtractionStrategy {
  /**
   * Extracts characters using Regular Expressions
   * @override
   * @param {string} html - HTML content to parse
   * @returns {Array<string>} Array of extracted characters
   * @throws {Error} If extraction fails
   */
  extract(html) {
    try {
      this.logger.info("Starting Regex extraction...");

      const pattern = this._buildRegexPattern();
      const characters = [];
      let match;
      let matchCount = 0;

      while ((match = pattern.exec(html)) !== null) {
        matchCount++;
        const value = match[1];
        characters.push(value);
        this.logger.debug(`Match ${matchCount}: "${value}"`);
      }

      this.logger.success(
        `Extracted ${characters.length} characters using Regex`
      );
      return characters;
    } catch (error) {
      this.logger.error("Regex extraction failed", error);
      throw new Error(`Regex extraction failed: ${error.message}`);
    }
  }

  /**
   * Builds the regex pattern for matching
   * @private
   * @returns {RegExp} Regex pattern
   */
  _buildRegexPattern() {
    // Build pattern dynamically from constants
    const sectionPattern = `<section[^>]*data-id="[^"]*${PATTERN.SECTION_DATA_ID}[^"]*"[^>]*>`;
    const articlePattern = `[\\s\\S]*?<article[^>]*data-class="[^"]*${PATTERN.ARTICLE_DATA_CLASS}[^"]*"[^>]*>`;
    const divPattern = `[\\s\\S]*?<div[^>]*data-tag="[^"]*${PATTERN.DIV_DATA_TAG}[^"]*"[^>]*>`;
    const bPattern = `[\\s\\S]*?<b[^>]*class="${PATTERN.B_CLASS}"[^>]*${PATTERN.VALUE_ATTRIBUTE}="([^"]*)"[^>]*>`;

    const fullPattern = sectionPattern + articlePattern + divPattern + bPattern;

    this.logger.debug("Regex pattern built");
    return new RegExp(fullPattern, "gi");
  }

  /**
   * Gets the strategy name
   * @override
   * @returns {string} Strategy name
   */
  getName() {
    return "Regex Strategy";
  }
}

module.exports = RegexStrategy;
