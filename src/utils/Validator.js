/**
 * Validator utility class for input validation
 * Follows Single Responsibility Principle - only handles validation
 * @class Validator
 */
class Validator {
  /**
   * Validates if a string is a valid URL
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   * @throws {Error} If URL is invalid
   */
  static validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      throw new Error(`Invalid URL provided: ${url}`);
    }
  }

  /**
   * Validates if HTML content is not empty
   * @param {string} html - HTML content to validate
   * @returns {boolean} True if valid HTML
   * @throws {Error} If HTML is empty or invalid
   */
  static validateHtml(html) {
    if (!html || typeof html !== "string") {
      throw new Error("HTML content is empty or invalid");
    }

    if (html.trim().length === 0) {
      throw new Error("HTML content is empty");
    }

    return true;
  }

  /**
   * Validates extracted characters array
   * @param {Array} characters - Array of extracted characters
   * @returns {boolean} True if valid
   * @throws {Error} If characters array is invalid
   */
  static validateCharacters(characters) {
    if (!Array.isArray(characters)) {
      throw new Error("Extracted characters must be an array");
    }

    if (characters.length === 0) {
      throw new Error("No characters were extracted from the HTML");
    }

    return true;
  }
}

module.exports = Validator;
