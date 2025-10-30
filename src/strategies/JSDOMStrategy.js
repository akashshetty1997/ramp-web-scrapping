const ExtractionStrategy = require("./ExtractionStrategy");
const { JSDOM } = require("jsdom");
const { PATTERN } = require("../config/constants");

/**
 * JSDOM-based extraction strategy
 * @class JSDOMStrategy
 * @extends ExtractionStrategy
 */
class JSDOMStrategy extends ExtractionStrategy {
  /**
   * Extracts characters using JSDOM
   * @override
   * @param {string} html - HTML content to parse
   * @returns {Array<string>} Array of extracted characters
   * @throws {Error} If extraction fails
   */
  extract(html) {
    try {
      this.logger.info("Starting JSDOM extraction...");

      // Create DOM from HTML
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Find all matching sections
      const selector = this._buildSelector();
      const sections = document.querySelectorAll(selector.section);
      this.logger.debug(`Found ${sections.length} sections`);

      const characters = [];

      sections.forEach((section, sectionIndex) => {
        try {
          // Find nested articles
          const articles = section.querySelectorAll(selector.article);

          articles.forEach((article) => {
            // Find nested divs
            const divs = article.querySelectorAll(selector.div);

            divs.forEach((div) => {
              // Find b tags with value
              const bTags = div.querySelectorAll(selector.b);

              bTags.forEach((b) => {
                const value = b.getAttribute(PATTERN.VALUE_ATTRIBUTE);
                if (value !== null && value !== undefined) {
                  characters.push(value);
                  this.logger.debug(`Found character: "${value}"`);
                }
              });
            });
          });
        } catch (error) {
          this.logger.warn(
            `Error processing section ${sectionIndex}: ${error.message}`
          );
        }
      });

      // Clean up JSDOM resources
      dom.window.close();

      this.logger.success(
        `Extracted ${characters.length} characters using JSDOM`
      );
      return characters;
    } catch (error) {
      this.logger.error("JSDOM extraction failed", error);
      throw new Error(`JSDOM extraction failed: ${error.message}`);
    }
  }

  /**
   * Builds CSS selectors for pattern matching
   * @private
   * @returns {Object} Object containing selectors
   */
  _buildSelector() {
    return {
      section: `section[data-id*="${PATTERN.SECTION_DATA_ID}"]`,
      article: `article[data-class*="${PATTERN.ARTICLE_DATA_CLASS}"]`,
      div: `div[data-tag*="${PATTERN.DIV_DATA_TAG}"]`,
      b: `b.${PATTERN.B_CLASS}[${PATTERN.VALUE_ATTRIBUTE}]`,
    };
  }

  /**
   * Gets the strategy name
   * @override
   * @returns {string} Strategy name
   */
  getName() {
    return "JSDOM Strategy";
  }
}

module.exports = JSDOMStrategy;
