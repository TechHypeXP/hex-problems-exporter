# Contributing to Hex Problems Exporter

## Welcome Contributors! 🎉

We're thrilled that you're interested in contributing to the Hex Problems Exporter. This document provides guidelines for contributing to the project.

## Code of Conduct

Please be respectful, inclusive, and considerate of others. Harassment and discrimination are not tolerated.

## How to Contribute

### Reporting Issues
1. Check existing issues before creating a new one
2. Use clear, descriptive titles
3. Provide detailed steps to reproduce the issue
4. Include your environment details (OS, VS Code version, etc.)

### Feature Requests
1. Explain the motivation behind the feature
2. Provide a clear use case
3. Discuss potential implementation approaches

## Development Setup

### Prerequisites
- Node.js (^16.x)
- Visual Studio Code (^1.60.0)
- TypeScript
- Git

### Local Development
1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Compile TypeScript: `npm run compile`
5. Run tests: `npm test`

## Coding Standards

### TypeScript
- Follow strict TypeScript guidelines
- Use PascalCase for classes and interfaces
- Use camelCase for variables and functions
- Write clear, concise comments
- Maintain 100% type safety

### Commit Messages
- Use conventional commits format
- Prefix with:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `refactor:` for code restructuring
  - `test:` for test-related changes

### Pull Request Process
1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new functionality
4. Describe changes in the PR description

## Testing

- Write unit tests for new functionality
- Maintain high test coverage
- Use Mocha and Chai for testing
- Run `npm run test:unit` to execute tests

## Code Review Process
- All submissions require review
- Be open to feedback
- Discuss technical details constructively

## Performance Considerations
- Optimize for minimal overhead
- Avoid blocking operations
- Use async/await for I/O operations

## Security
- Never commit sensitive information
- Use environment variables for secrets
- Keep dependencies updated

## Questions?
Open an issue or reach out to the maintainers.

Thank you for contributing! 🚀
