# Contributing to taskmark

First off, thank you for considering contributing to taskmark! It's people like you that make this project better.

## Code of Conduct

By participating in this project, you are expected to uphold a respectful and inclusive environment.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- A clear and descriptive title
- Steps to reproduce the problem
- Expected behavior
- Actual behavior
- Your environment (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setup

```bash
# Clone your fork
git clone https://github.com/your-username/taskmark.git
cd taskmark

# Install dependencies
npm install
```

### Development Commands

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck

# Build
npm run build

# Serve documentation locally
npm run docs:serve
```

### Testing

- Write tests for all new features
- Maintain or improve code coverage
- Run the full test suite before submitting PRs

### Code Style

This project uses Biome for linting and formatting. The configuration is in `biome.json`.

Key conventions:
- Use TypeScript for all source code
- Add JSDoc comments for public APIs
- Follow the existing code structure
- Use meaningful variable and function names
- Keep functions small and focused

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat: add new utility function
fix: resolve issue with type inference
docs: update API documentation
test: add tests for greet function
```

### Documentation

- Update README.md for significant changes
- Update docs/ for API changes
- Add JSDoc comments for public APIs
- Include code examples where appropriate

## Project Structure

```
taskmark/
├── .github/           # GitHub Actions workflows
├── docs/              # Documentation (Docsify)
├── src/               # Source code
│   ├── index.ts       # Main entry point
│   └── *.test.ts      # Test files
├── dist/              # Build output (generated)
├── package.json       # Package configuration
├── tsconfig.json      # TypeScript configuration
├── vitest.config.ts   # Vitest configuration
└── biome.json         # Biome configuration
```

## Release Process

Releases are automated via GitHub Actions:

1. Create a new version: `npm version [patch|minor|major]`
2. Push changes: `git push && git push --tags`
3. The CI/CD pipeline will automatically publish to npm

## Questions?

Feel free to open an issue for any questions or concerns!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

