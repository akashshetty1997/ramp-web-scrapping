#!/usr/bin/env node

/**
 * Main entry point for the Ramp CTF Challenge Solver
 * Follows Dependency Injection pattern for testability and flexibility
 * @module index
 */

// Import dependencies
const Logger = require("./src/utils/Logger");
const HttpClient = require("./src/services/HttpClient");
const HtmlParser = require("./src/services/HtmlParser");
const UrlExtractor = require("./src/services/UrlExtractor");

// Import strategies
const XPathStrategy = require("./src/strategies/XPathStrategy");
const JSDOMStrategy = require("./src/strategies/JSDOMStrategy");
const RegexStrategy = require("./src/strategies/RegexStrategy");

// Import constants
const { CHALLENGE_URL, LOG_LEVELS } = require("./src/config/constants");

/**
 * Main application class
 * @class RampCTFSolver
 */
class RampCTFSolver {
  /**
   * Creates a RampCTFSolver instance
   * @param {string} logLevel - Logging level
   */
  constructor(logLevel = LOG_LEVELS.INFO) {
    // Initialize logger
    this.logger = new Logger(logLevel);

    // Initialize services with dependency injection
    this.httpClient = new HttpClient(this.logger);

    // Initialize strategies
    const strategies = [
      new XPathStrategy(this.logger),
      new JSDOMStrategy(this.logger),
      new RegexStrategy(this.logger),
    ];

    // Initialize parser with strategies
    this.htmlParser = new HtmlParser(strategies, this.logger);

    // Initialize main extractor
    this.extractor = new UrlExtractor(
      this.httpClient,
      this.htmlParser,
      this.logger
    );
  }

  /**
   * Runs the CTF solver
   * @returns {Promise<Object>} Solution results
   */
  async run() {
    try {
      this.logger.info("🎮 Ramp CTF Challenge Solver v1.0.0");
      this.logger.info("Created by: Akash");
      this.logger.info("");

      const result = await this.extractor.extract(CHALLENGE_URL);

      this.logger.info("");
      this.logger.success("✨ Challenge completed successfully!");
      this.logger.info(
        "📋 Copy the flag and paste it in your Ramp application"
      );

      return result;
    } catch (error) {
      this.logger.error("Failed to solve challenge", error);
      process.exit(1);
    }
  }
}

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    debug: false,
    help: false,
  };

  args.forEach((arg) => {
    switch (arg) {
      case "--debug":
      case "-d":
        options.debug = true;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
    }
  });

  return options;
}

/**
 * Display help message
 */
function displayHelp() {
  console.log(`
Ramp CTF Challenge Solver

Usage: node index.js [options]

Options:
  -d, --debug    Enable debug logging
  -h, --help     Display this help message

Examples:
  node index.js           Run the solver
  node index.js --debug   Run with debug output
`);
}

/**
 * Main execution
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    displayHelp();
    process.exit(0);
  }

  const logLevel = options.debug ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
  const solver = new RampCTFSolver(logLevel);

  await solver.run();
}

// Execute if run directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
}

// Export for testing
module.exports = { RampCTFSolver };
