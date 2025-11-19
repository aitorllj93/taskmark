/**
 * TaskMark - A TypeScript library for parsing TaskMark-v1 formatted tasks
 */

// Export parse and stringify functions and types
export { parse, parseArray, type ParseConfig } from './parse';
export { stringify, stringifyArray, type StringifyConfig } from './stringify';
export type { Task, TaskState, TaskType, Focus, Energy, Duration, Priority } from './types';

// Export utility functions for modifying task strings
export {
  addDependency,
  addFocus,
  addTag,
  markAsCompleted,
  markAsIncomplete,
  removeDependency,
  removeDueDate,
  removeDuration,
  removeEnergy,
  removeFocus,
  removeScheduledDate,
  removeStartedDate,
  removeTag,
  removeTimeRange,
  setBlocking,
  setDueDate,
  setDuration,
  setEnergy,
  setPriority,
  setScheduledDate,
  setStartedDate,
  setState,
  setTimeRange,
} from './utils';
