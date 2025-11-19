# TaskMark

A TypeScript library for parsing and stringifying TaskMark-v1 formatted tasks. TaskMark-v1 is a strict Markdown syntax for describing structured tasks enriched with semantic metadata, hierarchical tags, and focus emojis.

## Features

- ✅ **Full TaskMark-v1 compliance** - Implements the complete TaskMark-v1 specification
- ✅ **TypeScript** - Fully typed with comprehensive type definitions
- ✅ **Parse & Stringify** - Convert between TaskMark strings and structured Task objects
- ✅ **Utility Functions** - Helper functions for modifying task strings without full parsing
- ✅ **Internationalization** - Support for custom tags and scenario prefixes
- ✅ **Validation** - Built-in validation using Zod schemas
- ✅ **ESM and CJS** - Supports both module systems

## Installation

```bash
npm install taskmark
```

## Quick Start

### Basic Parsing

```typescript
import { parse } from 'taskmark';

const taskString = '- [ ] 🎯 Write report #Tasks/Main_Mission 🌡️ high ⏱️ 90m 📅 2025-01-20';

const task = parse(taskString);
console.log(task);
// {
//   content: "Write report",
//   type: "main_mission",
//   focuses: ["critical"],
//   energy: "high",
//   duration: "90m",
//   dueAt: "2025-01-20",
//   ...
// }
```

### Basic Stringifying

```typescript
import { stringify } from 'taskmark';

const task = {
  state: 'incomplete',
  content: 'Write report',
  type: 'main_mission',
  tags: ['Tasks/Main_Mission'],
  focuses: ['critical'],
  energy: 'high',
  duration: '90m',
  dueAt: '2025-01-20',
  priority: 'normal',
};

const taskString = stringify(task);
// Returns: "- [ ] 🎯 Write report #Tasks/Main_Mission 🌡️ high ⏱️ 90m 📅 2025-01-20"
```

### Utility Functions

```typescript
import { markAsCompleted, setDueDate, addFocus } from 'taskmark';

let task = '- [ ] Buy groceries #Tasks/Quick';

// Mark as completed (adds completion date automatically)
task = markAsCompleted(task);
// Returns: "- [x] Buy groceries #Tasks/Quick ✅ 2025-01-15"

// Set due date
task = setDueDate(task, '2025-01-20');
// Returns: "- [x] Buy groceries #Tasks/Quick ✅ 2025-01-15 📅 2025-01-20"

// Add focus emoji
task = addFocus(task, 'critical');
// Returns: "- [x] 🎯 Buy groceries #Tasks/Quick ✅ 2025-01-15 📅 2025-01-20"
```

## TaskMark-v1 Format

TaskMark-v1 tasks follow this structure:

```
- [<state>] <focuses> <content> <tags> <energy> <duration> <dates> <priority> <dependencies>
```

### Example Task

```
- [ ] 🎯🔥 Implement authentication #Tasks/Main_Mission #Scenarios/Work/Programming 🧠 🌡️ high ⏱️ 90m 🔺 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-12 🆔 auth01 ⛔ task02
```

This task includes:
- **State**: `[ ]` (incomplete)
- **Focuses**: 🎯 (critical), 🔥 (hyper-focus), 🧠 (hard cognitive)
- **Type**: `#Tasks/Main_Mission`
- **Scenarios**: `#Scenarios/Work/Programming`
- **Energy**: 🌡️ high
- **Duration**: ⏱️ 90m
- **Priority**: 🔺 (maximum)
- **Dates**: Created (➕), Scheduled (⏳), Due (📅)
- **ID**: 🆔 auth01
- **Dependencies**: ⛔ task02

## Documentation

- **[Getting Started](docs/getting-started.md)** - Detailed guide with examples
- **[API Reference](docs/api.md)** - Complete API documentation
- **[TaskMark-v1 Specification](SPEC.md)** - Full specification document
- **[Contributing](CONTRIBUTING.md)** - How to contribute to the project

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Testing

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

# Fix linting errors
npm run lint:fix

# Format code
npm run format
```

### Type Checking

```bash
npm run typecheck
```

### Documentation

The documentation is built with [Docsify](https://docsify.js.org/) and published to GitHub Pages.

```bash
# Serve documentation locally
npm run docs:serve
```

Visit the documentation at: https://aitorllj93.github.io/taskmark/

## License

MIT
