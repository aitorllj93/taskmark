# Contributing

Thank you for your interest in contributing to TaskMark! This guide will help you get started.

## Understanding TaskMark

Before contributing, please familiarize yourself with:
- The [TaskMark-v1 Specification](SPEC.md) - The complete format specification
- The [API Reference](api.md) - How the library works
- The existing test files - Examples of expected behavior

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/taskmark.git
   cd taskmark
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development Workflow

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code
npm run format
```

### Type Checking

```bash
npm run typecheck
```

### Building

```bash
npm run build
```

### Testing Documentation

```bash
npm run docs:serve
```

## Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The configuration is in `biome.json`.

Key guidelines:
- Use TypeScript for all source files
- Write tests for new features
- Follow the existing code style
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Submitting Changes

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```

4. Create a Pull Request on GitHub

## Commit Message Convention

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Ensure linting passes
5. Update the README.md if needed

## Questions?

Feel free to open an issue if you have any questions!

