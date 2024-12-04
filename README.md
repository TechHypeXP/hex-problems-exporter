# Hex Problems Exporter

A powerful Visual Studio Code extension for exporting and analyzing diagnostic problems from your workspace.

## Version 1.2.0

**Release Date**: Descember 4, 2024
**Timestamp**: 11:30:00 UTC

### What's New in 1.2.0
- Enhanced architectural structure
- Improved separation of concerns
- More modular and extensible design
- Centralized type management

## Project Structure

```
src/
├── core/
│   ├── formatters/
│   │   ├── base/
│   │   │   └── BaseFormatter.ts       # Abstract base formatter
│   │   ├── interfaces/
│   │   │   └── IFormatter.ts          # Formatter interface
│   │   ├── implementations/
│   │   │   ├── CsvFormatter.ts
│   │   │   ├── JsonFormatter.ts
│   │   │   ├── MarkdownFormatter.ts
│   │   │   └── XlsxFormatter.ts
│   │   └── index.ts                   # Centralized formatter exports
│   ├── services/
│   │   ├── interfaces/
│   │   │   └── IProblemCollector.ts   # Problem collection interface
│   │   ├── ProblemCollector.ts        # Concrete problem collection
│   │   ├── ProblemExporter.ts         # Problem export logic
│   │   └── index.ts                   # Service exports
│   ├── types/
│   │   ├── common/
│   │   │   ├── OutputFormats.ts       # Enum/type definitions
│   │   │   └── Interfaces.ts          # Shared interfaces
│   │   ├── formatters/
│   │   │   └── FormatterTypes.ts      # Formatter-specific types
│   │   ├── problems/
│   │   │   └── ProblemTypes.ts        # Problem-related types
│   │   └── index.ts                   # Centralized type exports
│   └── utils/
│       ├── ErrorHandling.ts
│       └── Validation.ts
├── extension.ts                       # Main VS Code extension entry point
└── test/
    ├── unit/
    │   ├── formatters/
    │   │   ├── CsvFormatter.test.ts
    │   │   ├── JsonFormatter.test.ts
    │   │   ├── MarkdownFormatter.test.ts
    │   │   └── XlsxFormatter.test.ts
    │   ├── services/
    │   │   ├── ProblemCollector.test.ts
    │   │   └── ProblemExporter.test.ts
    │   └── utils/
    │       ├── ErrorHandling.test.ts
    │       └── Validation.test.ts
    └── integration/
        └── ExtensionIntegration.test.ts
```

## Key Architectural Improvements

1. **Enhanced Separation of Concerns**
   - Distinct directories for interfaces, implementations
   - Centralized type management
   - Utility functions separated
   - Clear test structure mirroring source structure

2. **Naming Conventions**
   - PascalCase for classes and interfaces
   - Descriptive, purpose-driven file names
   - Grouped related files in subdirectories

3. **Type Centralization**
   - Comprehensive type management
   - Separated by domain (common, formatters, problems)
   - Single source of truth for type definitions

## Features

- **Dynamic Export**
  - Interactive format selection
  - Export problems in multiple formats:
    * Markdown
    * JSON
    * CSV
    * Excel (XLSX)

- **Comprehensive Problem Analysis**
  - Group problems by:
    * Type (Error, Warning, Information)
    * Source
    * Error Code

- **Detailed Problem Information**
  - Filename
  - Location (line and column)
  - Error message
  - Related information

## Installation

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Hex Problems Exporter"
4. Click Install

## Usage

1. Open a workspace with diagnostic problems
2. Open the Command Palette (Ctrl+Shift+P)
3. Type "Export Problems Report"
4. Choose your desired output format
5. Select save location

### Export Options

- **Markdown**: Human-readable report
- **JSON**: Structured data for further processing
- **CSV**: Easy import to spreadsheet software
- **Excel (XLSX)**: Comprehensive spreadsheet with multiple sheets

## Requirements

- Visual Studio Code ^1.60.0
- Node.js ^16.x

## Supported Languages

Works with any language supported by VS Code's diagnostic APIs, including:
- TypeScript
- JavaScript
- Python
- C++
- And more!

## Performance

Optimized for both small and large workspaces, with progress indication during export.

## Troubleshooting

- Ensure you have an active workspace
- Check VS Code's Problems view for existing diagnostics

## Contributing

Contributions are welcome! Please check our GitHub repository for guidelines.

## License

MIT License

## Release Notes

### 1.2.0
- Enhanced architectural structure
- Improved separation of concerns
- More modular and extensible design
- Centralized type management

### 1.1.0
- Added dynamic format selection
- Implemented XLSX export with ExcelJS
- Enhanced problem grouping
- Improved error handling
- Modular project restructure

### 1.0.0
- Initial release

## Future Roadmap
- LLM integration for problem analysis
- Custom problem filtering
- More export formats
- Performance optimizations

## Support

Found an issue? Please report it on our GitHub repository.

---

Created with ❤️ by the Hex Problems Exporter Team
