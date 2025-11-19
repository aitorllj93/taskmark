/**
 * TaskMark - A TypeScript library for parsing TaskMark-v1 formatted tasks
 */

// Export parse and stringify functions and types
export { type ParseConfig, parse, parseArray } from "./parse";
export {
	validateTask,
	validateTaskWithErrors,
} from "./schema";
export { type StringifyConfig, stringify, stringifyArray } from "./stringify";
export type {
	Duration,
	Energy,
	Focus,
	Priority,
	Task,
	TaskState,
	TaskType,
} from "./types";

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
} from "./utils";
