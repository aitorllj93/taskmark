# API Reference

## Core Functions

### `parse`

Parses a TaskMark-v1 formatted string into a structured Task object.

**Signature:**
```typescript
function parse<TScenario extends string = string>(
  line: string,
  config?: ParseConfig<TScenario>
): Omit<Task, 'scenarios'> & { scenarios?: TScenario[] }
```

**Parameters:**
- `line` (string): A single line containing a TaskMark-v1 formatted task
- `config` (ParseConfig, optional): Configuration for parsing, including internationalization options

**Returns:**
- A Task object with all parsed metadata

**Throws:**
- `Error`: If the task format is invalid (missing state, missing type, empty content, etc.)

**Example:**
```typescript
import { parse } from 'taskmark';

const task = parse('- [ ] 🎯 Write report #Tasks/Main_Mission 🌡️ high ⏱️ 90m');
console.log(task.content); // "Write report"
console.log(task.type);    // "main_mission"
console.log(task.focuses); // ["critical"]
```

---

### `parseArray`

Parses multiple tasks from a multiline string.

**Signature:**
```typescript
function parseArray<TScenario extends string = string>(
  text: string,
  config?: ParseConfig<TScenario>
): Array<Omit<Task, 'scenarios'> & { scenarios?: TScenario[] }>
```

**Parameters:**
- `text` (string): Multiline string containing multiple tasks (one per line)
- `config` (ParseConfig, optional): Configuration for parsing

**Returns:**
- Array of parsed Task objects

**Example:**
```typescript
import { parseArray } from 'taskmark';

const tasks = parseArray(`
- [ ] First task #Tasks/Quick
- [x] Second task #Tasks/Main_Mission
`);
console.log(tasks.length); // 2
```

---

### `stringify`

Converts a Task object back into a TaskMark-v1 formatted string.

**Signature:**
```typescript
function stringify<TScenario extends string = string>(
  task: Task & { scenarios?: TScenario[] },
  config?: StringifyConfig<TScenario>
): string
```

**Parameters:**
- `task` (Task): The task object to stringify
- `config` (StringifyConfig, optional): Configuration for stringifying, including internationalization options

**Returns:**
- A TaskMark-v1 formatted string

**Example:**
```typescript
import { stringify } from 'taskmark';

const task = {
  state: 'incomplete',
  content: 'Write report',
  type: 'main_mission',
  tags: ['Tasks/Main_Mission'],
  priority: 'normal',
};

const taskString = stringify(task);
// Returns: "- [ ] Write report #Tasks/Main_Mission"
```

---

### `stringifyArray`

Converts an array of tasks into a multiline string.

**Signature:**
```typescript
function stringifyArray<TScenario extends string = string>(
  tasks: Array<Task & { scenarios?: TScenario[] }>,
  config?: StringifyConfig<TScenario>
): string
```

**Parameters:**
- `tasks` (Array<Task>): Array of tasks to stringify
- `config` (StringifyConfig, optional): Configuration for stringifying

**Returns:**
- Multiline string with each task on a separate line

**Example:**
```typescript
import { stringifyArray } from 'taskmark';

const tasks = [
  { state: 'incomplete', content: 'Task 1', type: 'quick', tags: ['Tasks/Quick'], priority: 'normal' },
  { state: 'completed', content: 'Task 2', type: 'quick', tags: ['Tasks/Quick'], priority: 'normal' },
];

const text = stringifyArray(tasks);
// Returns: "- [ ] Task 1 #Tasks/Quick\n- [x] Task 2 #Tasks/Quick"
```

---

## Configuration Types

### `ParseConfig`

Configuration object for parsing tasks.

```typescript
interface ParseConfig<TScenario extends string = string> {
  /**
   * Custom mapping from task tags to task types
   * Allows internationalization, e.g.:
   * { "Tareas/Mision_Principal": "main_mission" }
   */
  typeTagMapping?: Record<string, TaskType>;

  /**
   * Custom prefix for scenario tags
   * Default: "Scenarios/"
   * Example: "Escenarios/" for Spanish
   */
  scenarioPrefix?: string;

  /**
   * Custom mapping from scenario tags to normalized scenario names
   * Allows internationalization, e.g.:
   * { "Escenarios/Trabajo": "work", "Escenarios/Casa": "home" }
   */
  scenarioMapping?: Record<string, TScenario>;
}
```

**Example:**
```typescript
const config: ParseConfig = {
  typeTagMapping: {
    'Tareas/Mision_Principal': 'main_mission',
    'Tareas/Rapida': 'quick',
  },
  scenarioPrefix: 'Escenarios/',
  scenarioMapping: {
    'Escenarios/Trabajo': 'work',
  },
};
```

---

### `StringifyConfig`

Configuration object for stringifying tasks.

```typescript
interface StringifyConfig<TScenario extends string = string> {
  /**
   * Custom mapping from task types to task tags
   * Allows internationalization, e.g.:
   * { "main_mission": "Tareas/Mision_Principal" }
   * This is the inverse of ParseConfig.typeTagMapping
   */
  typeTagMapping?: Record<TaskType, string>;

  /**
   * Custom prefix for scenario tags
   * Default: "Scenarios/"
   * Example: "Escenarios/" for Spanish
   */
  scenarioPrefix?: string;

  /**
   * Custom mapping from normalized scenario names to scenario tags
   * Allows internationalization, e.g.:
   * { "work": "Escenarios/Trabajo", "home": "Escenarios/Casa" }
   * This is the inverse of ParseConfig.scenarioMapping
   */
  scenarioMapping?: Record<TScenario, string>;
}
```

---

## Task Type

### `Task`

The main Task interface representing a parsed task.

```typescript
interface Task {
  /** Current state of the task */
  state: TaskState;

  /** The main text content of the task */
  content: string;

  /** Type/category of the task */
  type: TaskType;

  /** List of tags associated with the task */
  tags: string[];

  /** Unique identifier for the task */
  id?: string;

  /** List of focus types for the task */
  focuses?: Focus[];

  /** List of scenarios where this task applies */
  scenarios?: string[];

  /** Energy level required for the task */
  energy?: Energy;

  /** Estimated duration of the task */
  duration?: Duration;

  /** Whether this task blocks other tasks */
  blocking?: boolean;

  /** Date when the task was created (YYYY-MM-DD) */
  createdAt?: string;

  /** Date when the task is scheduled (YYYY-MM-DD) */
  scheduledAt?: string;

  /** Date when the task was started (YYYY-MM-DD) */
  startedAt?: string;

  /** Date when the task is due (YYYY-MM-DD) */
  dueAt?: string;

  /** Date when the task was completed (YYYY-MM-DD) */
  completedAt?: string;

  /** Date when the task was cancelled (YYYY-MM-DD) */
  cancelledAt?: string;

  /** Time range for the task */
  time?: {
    start: string; // HH:MM format
    end: string;    // HH:MM format
  };

  /** Priority level of the task (defaults to 'normal') */
  priority: Priority;

  /** Recurrence pattern for the task */
  recurrence?: string;

  /** List of task IDs that this task depends on */
  dependencies?: string[];

  /** Hooks that trigger actions when certain events occur */
  hooks?: {
    /** Actions to execute when the task is completed */
    onCompletion?: string[];
  };
}
```

---

## Type Definitions

### `TaskState`

Possible task states:

```typescript
type TaskState =
  | 'incomplete'      // [ ]
  | 'completed'       // [x]
  | 'in_progress'     // [/]
  | 'cancelled'       // [-]
  | 'forwarded'       // [>]
  | 'migrated'        // [<]
  | 'scheduled'       // [@]
  | 'question'        // [?]
  | 'important'       // [!]
  | 'add'             // [+]
  | 'research'        // [R]
  | 'idea'            // [i]
  | 'brainstorm'      // [B]
  | 'location_based'   // [L]
  | 'bookmark';       // [b]
```

---

### `TaskType`

Possible task types:

```typescript
type TaskType =
  | 'main_mission'
  | 'secondary_mission'
  | 'maintenance'
  | 'quick'
  | 'admin';
```

---

### `Focus`

Possible focus types:

```typescript
type Focus =
  | 'critical'        // 🎯
  | 'mechanical'      // 🔧
  | 'maintenance'     // 🧹
  | 'hyper_focus'     // 🔥
  | 'low_energy'      // 🐢
  | 'high_energy'     // ⚡
  | 'chunking'        // 🪓
  | 'errands'         // 📦
  | 'hard_cognitive'; // 🧠
```

---

### `Energy`

Energy level values:

```typescript
type Energy = 'high' | 'medium' | 'low';
```

---

### `Duration`

Duration format (e.g., "15m", "90m", "2h"):

```typescript
type Duration = string; // Matches regex: /^\d+(?:\.\d+)?(?:ms|s|m|h|d|w|y)$/i
```

---

### `Priority`

Priority values:

```typescript
type Priority =
  | 'maximum'  // 🔺
  | 'high'     // ⏫
  | 'medium'   // 🔼
  | 'normal'   // (no emoji)
  | 'low'      // 🔽
  | 'minimum'; // ⏬
```

---

## Utility Functions

### `markAsCompleted`

Marks a task as completed by changing its state to `[x]` and optionally adds/updates the completion date.

**Signature:**
```typescript
function markAsCompleted(taskString: string, completedDate?: string): string
```

**Parameters:**
- `taskString` (string): The task string to modify
- `completedDate` (string, optional): Completion date in YYYY-MM-DD format. If not provided, uses today's date

**Returns:**
- The modified task string

**Example:**
```typescript
import { markAsCompleted } from 'taskmark';

const result = markAsCompleted('- [ ] Buy groceries #Tasks/Quick', '2025-01-20');
// Returns: "- [x] Buy groceries #Tasks/Quick ✅ 2025-01-20"
```

---

### `markAsIncomplete`

Marks a task as incomplete by changing its state to `[ ]`.

**Signature:**
```typescript
function markAsIncomplete(taskString: string): string
```

---

### `setState`

Sets the task state to a specific state.

**Signature:**
```typescript
function setState(taskString: string, state: string): string
```

**Example:**
```typescript
import { setState } from 'taskmark';

const result = setState('- [ ] Task #Tasks/Quick', 'in_progress');
// Returns: "- [/] Task #Tasks/Quick"
```

---

### `setDueDate`

Sets or updates the due date for a task.

**Signature:**
```typescript
function setDueDate(taskString: string, date: string): string
```

**Throws:**
- `Error`: If date format is invalid (must be YYYY-MM-DD)

---

### `removeDueDate`

Removes the due date from a task.

**Signature:**
```typescript
function removeDueDate(taskString: string): string
```

---

### `setScheduledDate`

Sets or updates the scheduled date for a task.

**Signature:**
```typescript
function setScheduledDate(taskString: string, date: string): string
```

---

### `removeScheduledDate`

Removes the scheduled date from a task.

**Signature:**
```typescript
function removeScheduledDate(taskString: string): string
```

---

### `setStartedDate`

Sets or updates the started date for a task.

**Signature:**
```typescript
function setStartedDate(taskString: string, date: string): string
```

---

### `removeStartedDate`

Removes the started date from a task.

**Signature:**
```typescript
function removeStartedDate(taskString: string): string
```

---

### `setPriority`

Sets or updates the priority for a task.

**Signature:**
```typescript
function setPriority(taskString: string, priority: string): string
```

**Throws:**
- `Error`: If priority is invalid

**Example:**
```typescript
import { setPriority } from 'taskmark';

const result = setPriority('- [ ] Task #Tasks/Quick', 'high');
// Returns: "- [ ] Task #Tasks/Quick ⏫"
```

---

### `setEnergy`

Sets or updates the energy level for a task.

**Signature:**
```typescript
function setEnergy(taskString: string, energy: string): string
```

**Throws:**
- `Error`: If energy is invalid (must be 'high', 'medium', or 'low')

---

### `removeEnergy`

Removes the energy level from a task.

**Signature:**
```typescript
function removeEnergy(taskString: string): string
```

---

### `setDuration`

Sets or updates the duration for a task.

**Signature:**
```typescript
function setDuration(taskString: string, duration: string): string
```

**Example:**
```typescript
import { setDuration } from 'taskmark';

const result = setDuration('- [ ] Task #Tasks/Quick', '90m');
// Returns: "- [ ] Task #Tasks/Quick ⏱️ 90m"
```

---

### `removeDuration`

Removes the duration from a task.

**Signature:**
```typescript
function removeDuration(taskString: string): string
```

---

### `setBlocking`

Sets or removes the blocking flag for a task.

**Signature:**
```typescript
function setBlocking(taskString: string, blocking: boolean): string
```

**Example:**
```typescript
import { setBlocking } from 'taskmark';

const result = setBlocking('- [ ] Task #Tasks/Quick', true);
// Returns: "- [ ] Task #Tasks/Quick 🔒"
```

---

### `addFocus`

Adds a focus emoji to a task.

**Signature:**
```typescript
function addFocus(taskString: string, focus: string): string
```

**Throws:**
- `Error`: If focus is invalid

**Example:**
```typescript
import { addFocus } from 'taskmark';

const result = addFocus('- [ ] Task #Tasks/Quick', 'critical');
// Returns: "- [ ] 🎯 Task #Tasks/Quick"
```

---

### `removeFocus`

Removes a focus emoji from a task.

**Signature:**
```typescript
function removeFocus(taskString: string, focus: string): string
```

---

### `addTag`

Adds a tag to a task.

**Signature:**
```typescript
function addTag(taskString: string, tag: string): string
```

**Example:**
```typescript
import { addTag } from 'taskmark';

const result = addTag('- [ ] Task #Tasks/Quick', 'urgent');
// Returns: "- [ ] Task #Tasks/Quick #urgent"
```

---

### `removeTag`

Removes a tag from a task.

**Signature:**
```typescript
function removeTag(taskString: string, tag: string): string
```

---

### `setTimeRange`

Sets or updates the time range for a task.

**Signature:**
```typescript
function setTimeRange(taskString: string, start: string, end: string): string
```

**Throws:**
- `Error`: If time format is invalid (must be HH:MM)

**Example:**
```typescript
import { setTimeRange } from 'taskmark';

const result = setTimeRange('- [ ] Task #Tasks/Quick', '09:00', '10:30');
// Returns: "- [ ] Task #Tasks/Quick ⏰ [09:00 - 10:30]"
```

---

### `removeTimeRange`

Removes the time range from a task.

**Signature:**
```typescript
function removeTimeRange(taskString: string): string
```

---

### `addDependency`

Adds a dependency to a task.

**Signature:**
```typescript
function addDependency(taskString: string, taskId: string): string
```

**Example:**
```typescript
import { addDependency } from 'taskmark';

const result = addDependency('- [ ] Task #Tasks/Quick', 'task01');
// Returns: "- [ ] Task #Tasks/Quick ⛔ task01"
```

---

### `removeDependency`

Removes a dependency from a task.

**Signature:**
```typescript
function removeDependency(taskString: string, taskId: string): string
```

---

## Error Handling

All parsing functions throw errors when encountering invalid input:

- `Invalid task format: missing state` - Task doesn't start with `- [<state>]`
- `Invalid task state symbol: <symbol>` - Unknown state symbol
- `Invalid task format: missing task type` - No valid type tag found
- `Invalid task format: empty content` - Task has no content after metadata extraction

All utility functions validate their inputs and throw descriptive errors for invalid formats.

## Examples

### Complete Example

```typescript
import { parse, stringify, markAsCompleted, setDueDate } from 'taskmark';

// Parse a complex task
const taskString = '- [ ] 🎯🔥 Implement auth #Tasks/Main_Mission #Scenarios/Work/Programming 🧠 🌡️ high ⏱️ 90m 🔺 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-12 🆔 auth01 ⛔ task02';

const task = parse(taskString);
console.log(task);
// {
//   state: 'incomplete',
//   content: 'Implement auth',
//   type: 'main_mission',
//   tags: ['Tasks/Main_Mission', 'Scenarios/Work/Programming'],
//   focuses: ['critical', 'hyper_focus', 'hard_cognitive'],
//   scenarios: ['Work/Programming'],
//   energy: 'high',
//   duration: '90m',
//   priority: 'maximum',
//   createdAt: '2025-01-10',
//   scheduledAt: '2025-01-11',
//   dueAt: '2025-01-12',
//   id: 'auth01',
//   dependencies: ['task02']
// }

// Modify the task
let modified = markAsCompleted(taskString, '2025-01-15');
modified = setDueDate(modified, '2025-01-20');

// Or modify the object and stringify
task.state = 'completed';
task.completedAt = '2025-01-15';
task.dueAt = '2025-01-20';
const newString = stringify(task);
```

---

For more information, see the [TaskMark-v1 Specification](SPEC.md).
