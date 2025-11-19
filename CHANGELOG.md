# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-11-19

### Added
- Full TaskMark-v1 specification compliance
- `parse()` and `parseArray()` functions for parsing TaskMark strings to structured Task objects
- `stringify()` and `stringifyArray()` functions for converting Task objects to TaskMark strings
- Comprehensive utility functions for modifying task strings:
  - State management: `markAsCompleted()`, `markAsIncomplete()`, `setState()`
  - Focus management: `addFocus()`, `removeFocus()`
  - Tag management: `addTag()`, `removeTag()`
  - Date management: `setDueDate()`, `removeDueDate()`, `setScheduledDate()`, `removeScheduledDate()`, `setStartedDate()`, `removeStartedDate()`
  - Time management: `setDuration()`, `removeDuration()`, `setTimeRange()`, `removeTimeRange()`
  - Task properties: `setEnergy()`, `removeEnergy()`, `setPriority()`, `setBlocking()`
  - Dependencies: `addDependency()`, `removeDependency()`
- Full TypeScript support with comprehensive type definitions
- Zod-based validation for task schemas
- Internationalization support for custom tags and scenario prefixes
- ESM and CommonJS module support
- Complete test coverage
- Full API documentation
- TaskMark-v1 specification document
- Documentation site with Docsify
- Benchmark suite for performance testing

