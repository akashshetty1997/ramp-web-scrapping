/**
 * Configuration constants for the CTF challenge
 * @module config/constants
 */

module.exports = {
  CHALLENGE_URL:
    "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge",

  // DOM Pattern requirements
  PATTERN: {
    SECTION_DATA_ID: "92",
    ARTICLE_DATA_CLASS: "45",
    DIV_DATA_TAG: "78",
    B_CLASS: "ref",
    VALUE_ATTRIBUTE: "value",
  },

  // HTTP Configuration
  HTTP: {
    TIMEOUT: 10000, // 10 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
  },

  // Logging levels
  LOG_LEVELS: {
    ERROR: "ERROR",
    WARN: "WARN",
    INFO: "INFO",
    DEBUG: "DEBUG",
  },
};
