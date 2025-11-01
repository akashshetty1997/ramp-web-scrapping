# 🔍 Ramp CTF Challenge Solver

A robust Node.js solution for the Ramp CTF (Capture The Flag) challenge that extracts a hidden URL from HTML by identifying specific DOM patterns. Built with SOLID principles and multiple fallback strategies for maximum reliability.

## 📊 Challenge Results

| Metric | Value |
|--------|-------|
| **Status** | ✅ SOLVED |
| **Flag** | `sunbeam` |
| **Hidden URL** | `https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/73756e` |
| **Characters Extracted** | 75 |
| **Execution Time** | < 1 second |
| **Success Rate** | 100% |

## 🎯 Challenge Overview

The Ramp CTF challenge requires finding a hidden URL where each character is embedded in a specific DOM structure pattern:
```html
<section data-id="92*">
  <article data-class="*45">
    <div data-tag="*78*">
      <b class="ref" value="CHARACTER"></b>
    </div>
  </article>
</section>
```

Where `*` represents a wildcard (zero or more characters).

## 🚀 Quick Start

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/akashshetty1997/ramp-web-scraping.git
cd ramp-web-scraping

# Install dependencies
npm install
```

### Running the Solver
```bash
# Run the solver
npm start

# Run with debug output
npm run debug

# Run tests (optional)
npm test
```

## 🏗️ Architecture

This solution follows **SOLID principles** and implements multiple design patterns for a robust, maintainable, and extensible codebase.

### Design Patterns Used

1. **Strategy Pattern**: Multiple extraction strategies (XPath, JSDOM, Regex)
2. **Dependency Injection**: Loose coupling between components
3. **Single Responsibility**: Each class has one clear purpose
4. **Open/Closed Principle**: Easy to add new strategies without modifying existing code

### Project Structure
```
ramp-web-scraping/
├── index.js                    # Main entry point
├── package.json                # Node.js dependencies
├── README.md                   # Documentation
├── .gitignore                  # Git ignore rules
└── src/
    ├── config/
    │   └── constants.js        # Configuration constants
    ├── services/
    │   ├── HttpClient.js       # HTTP request handling
    │   ├── HtmlParser.js       # HTML parsing orchestrator
    │   └── UrlExtractor.js     # Main extraction workflow
    ├── strategies/
    │   ├── ExtractionStrategy.js   # Abstract base strategy
    │   ├── XPathStrategy.js        # XPath-based extraction
    │   ├── JSDOMStrategy.js        # JSDOM-based extraction
    │   └── RegexStrategy.js        # Regex fallback strategy
    └── utils/
        ├── Logger.js           # Logging utility
        └── Validator.js        # Input validation
```

## 🔧 Technical Features

### Multiple Extraction Strategies
The solver implements three different extraction methods to ensure reliability:

1. **XPath Strategy** - Most precise DOM traversal
2. **JSDOM Strategy** - Modern DOM manipulation (successfully extracted the flag)
3. **Regex Strategy** - Pattern matching fallback

### Robust Error Handling
- Comprehensive try-catch blocks
- Retry logic with exponential backoff
- Graceful fallback between strategies
- Detailed error logging

### Professional Logging
- Multiple log levels (ERROR, WARN, INFO, DEBUG)
- Color-coded console output
- Detailed progress tracking
- Debug mode for troubleshooting

## 📈 Performance Metrics

Based on successful execution:
```
✅ HTML Fetch: 49,748 characters retrieved
✅ Extraction Strategies:
   - XPath: 0 matches (fallback triggered)
   - JSDOM: 75 characters extracted ✅
   - Regex: Not needed (success achieved)
✅ URL Construction: Perfect character ordering
✅ Flag Retrieval: Successful on first attempt
```

## 🛠️ How It Works

1. **Fetches HTML** from the challenge URL using a custom HTTP client with retry logic
2. **Parses the DOM** using multiple strategies until successful extraction
3. **Extracts characters** from the `value` attribute of matching `<b>` tags
4. **Constructs the URL** by joining all characters in order
5. **Retrieves the flag** by accessing the hidden URL

## 📝 Code Quality

- **Clean Code**: Following Uncle Bob's Clean Code principles
- **SOLID Principles**: All five principles properly implemented
- **Documentation**: Comprehensive JSDoc comments
- **Error Handling**: Production-ready error management
- **Modularity**: Highly modular and testable components
- **No External Dependencies**: Only essential npm packages used

## 🔍 Debug Output Example
```bash
npm run debug

# Output shows:
🔍 [DEBUG] Found 75 sections
🔍 [DEBUG] Found character: "h"
🔍 [DEBUG] Found character: "t"
🔍 [DEBUG] Found character: "t"
... (75 total characters)
✅ [SUCCESS] Flag retrieved: sunbeam
```

## 🏆 Solution Highlights

- **Resilient Architecture**: Multiple fallback strategies ensure success even when primary methods fail
- **Professional Engineering**: Production-ready code with proper error handling and logging
- **SOLID Principles**: Textbook implementation of software design principles
- **Clean Execution**: Zero errors, warnings, or crashes during execution
- **Maintainable**: Easy to extend with new strategies or modify existing ones

## 📦 Dependencies
```json
{
  "jsdom": "^23.0.1",    // DOM manipulation
  "xpath": "^0.0.33",    // XPath evaluation  
  "xmldom": "^0.6.0"     // XML/HTML parsing
}
```

## 🤝 Author

**Akash**  
MS Computer Science Student @ Northeastern University  

## 📄 License

MIT License - feel free to use this code for your own CTF challenges!

## 🎉 Acknowledgments

Thanks to Ramp for creating this engaging CTF challenge. The challenge tested:
- Web scraping skills
- DOM manipulation
- Pattern recognition
- Software architecture
- Error handling

## 💡 Lessons Learned

1. **Always implement fallback strategies** - The XPath strategy found 0 matches, but JSDOM saved the day
2. **Logging is crucial** - Debug mode revealed exactly how the solution worked
3. **SOLID principles matter** - The modular architecture made it easy to add strategies
4. **Clean code pays off** - Well-structured code made debugging straightforward

---

**Final Flag: `sunbeam`** 🎯
