const ExtractionStrategy = require("./ExtractionStrategy");
const xpath = require("xpath");
const { DOMParser } = require("xmldom");
const { PATTERN } = require("../config/constants");

/**
 * XPath-based extraction strategy
 * @class XPathStrategy
 * @extends ExtractionStrategy
 */
class XPathStrategy extends ExtractionStrategy {
  /**
   * Creates an XPathStrategy instance
   * @param {Logger} logger - Logger instance
   */
  constructor(logger) {
    super(logger);
    this.parser = new DOMParser({
      locator: {},
      errorHandler: {
        warning: (msg) => this.logger.warn(`XML Parser Warning: ${msg}`),
        error: (msg) => this.logger.error(`XML Parser Error: ${msg}`),
        fatalError: (msg) => this.logger.error(`XML Parser Fatal: ${msg}`),
      },
    });
  }

  /**
   * Extracts characters using XPath
   * @override
   * @param {string} html - HTML content to parse
   * @returns {Array<string>} Array of extracted characters
   * @throws {Error} If extraction fails
   */
  extract(html) {
    try {
      this.logger.info("Starting XPath extraction...");

      // Parse HTML into DOM
      const doc = this.parser.parseFromString(html, "text/html");

      // Build XPath expression
      const xpathExpression = this._buildXPathExpression();
      this.logger.debug("XPath expression:", xpathExpression);

      // Select matching nodes
      const nodes = xpath.select(xpathExpression, doc);
      this.logger.info(`Found ${nodes.length} matching elements`);

      // Extract values
      const characters = [];
      nodes.forEach((node, index) => {
        try {
          const value = node.getAttribute(PATTERN.VALUE_ATTRIBUTE);
          if (value !== null && value !== undefined) {
            characters.push(value);
            this.logger.debug(`Character ${index + 1}: "${value}"`);
          }
        } catch (error) {
          this.logger.warn(
            `Failed to extract value from node ${index}: ${error.message}`
          );
        }
      });

      this.logger.success(
        `Extracted ${characters.length} characters using XPath`
      );
      return characters;
    } catch (error) {
      this.logger.error("XPath extraction failed", error);
      throw new Error(`XPath extraction failed: ${error.message}`);
    }
  }

  /**
   * Builds the XPath expression for pattern matching
   * @private
   * @returns {string} XPath expression
   */
  _buildXPathExpression() {
    return (
      `//section[contains(@data-id, '${PATTERN.SECTION_DATA_ID}')]` +
      `//article[contains(@data-class, '${PATTERN.ARTICLE_DATA_CLASS}')]` +
      `//div[contains(@data-tag, '${PATTERN.DIV_DATA_TAG}')]` +
      `//b[@class='${PATTERN.B_CLASS}']`
    );
  }

  /**
   * Gets the strategy name
   * @override
   * @returns {string} Strategy name
   */
  getName() {
    return "XPath Strategy";
  }
}

module.exports = XPathStrategy;
