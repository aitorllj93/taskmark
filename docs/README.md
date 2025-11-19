# TaskMark Documentation

Welcome to the TaskMark documentation! TaskMark is a TypeScript library for parsing and stringifying TaskMark-v1 formatted tasks.

## What is TaskMark?

TaskMark-v1 is a strict Markdown syntax for describing structured tasks enriched with semantic metadata, hierarchical tags, and focus emojis. It is designed to support personal task management—especially for individuals who struggle with organization, executive function, or ADHD—by providing a clear and predictable structure that can be reliably interpreted by computer programs, humans, and AI systems alike.

## Documentation

- **[Getting Started](getting-started.md)** - Learn how to use TaskMark in your project
- **[API Reference](api.md)** - Complete API documentation with examples
- **[Contributing](../CONTRIBUTING.md)** - How to contribute to the project

## Specification

The complete TaskMark-v1 specification is available in [SPEC.md](SPEC.md). This document defines:

- Task structure and format
- All supported states, types, focuses, and metadata
- Rules and validation requirements
- Official examples

## Quick Example

```typescript
import { parse, stringify } from 'taskmark';

// Parse a task
const task = parse('- [ ] 🎯 Write report #Tasks/Main_Mission 🌡️ high ⏱️ 90m 📅 2025-01-20');

console.log(task.content);  // "Write report"
console.log(task.type);     // "main_mission"
console.log(task.focuses);  // ["critical"]
console.log(task.energy);   // "high"
console.log(task.duration); // "90m"
console.log(task.dueAt);    // "2025-01-20"

// Stringify a task
const taskString = stringify(task);
// Returns: "- [ ] 🎯 Write report #Tasks/Main_Mission 🌡️ high ⏱️ 90m 📅 2025-01-20"
```

## Features

- ✅ **Full TaskMark-v1 compliance** - Implements the complete specification
- ✅ **TypeScript** - Fully typed with comprehensive type definitions
- ✅ **Parse & Stringify** - Convert between TaskMark strings and structured objects
- ✅ **Utility Functions** - Helper functions for modifying task strings
- ✅ **Internationalization** - Support for custom tags and scenario prefixes
- ✅ **Validation** - Built-in validation using Zod schemas
- ✅ **ESM and CJS** - Supports both module systems

## Installation

```bash
npm install taskmark
```

## License

MIT
