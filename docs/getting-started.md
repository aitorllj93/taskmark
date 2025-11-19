# Getting Started

## Installation

Install TaskMark using npm:

```bash
npm install taskmark
```

Or using yarn:

```bash
yarn add taskmark
```

Or using pnpm:

```bash
pnpm add taskmark
```

## Basic Usage

### Parsing Tasks

The `parse` function converts a TaskMark-v1 formatted string into a structured Task object:

```typescript
import { parse } from 'taskmark';

const taskString = '- [ ] 🎯 Write quarterly report #Tasks/Main_Mission 🌡️ high ⏱️ 90m 📅 2025-01-20';

const task = parse(taskString);

console.log(task);
// {
//   state: "incomplete",
//   content: "Write quarterly report",
//   type: "main_mission",
//   focuses: ["critical"],
//   energy: "high",
//   duration: "90m",
//   dueAt: "2025-01-20",
//   priority: "normal",
//   ...
// }
```

### Stringifying Tasks

The `stringify` function converts a Task object back into a TaskMark-v1 formatted string:

```typescript
import { stringify } from 'taskmark';
import type { Task } from 'taskmark';

const task: Task = {
  state: 'incomplete',
  content: 'Write quarterly report',
  type: 'main_mission',
  tags: ['Tasks/Main_Mission'],
  focuses: ['critical'],
  energy: 'high',
  duration: '90m',
  dueAt: '2025-01-20',
  priority: 'normal',
};

const taskString = stringify(task);
// Returns: "- [ ] 🎯 Write quarterly report #Tasks/Main_Mission 🌡️ high ⏱️ 90m 📅 2025-01-20"
```

### Parsing Multiple Tasks

Use `parseArray` to parse multiple tasks from a multiline string:

```typescript
import { parseArray } from 'taskmark';

const tasksText = `
- [ ] First task #Tasks/Quick
- [x] Second task #Tasks/Main_Mission ✅ 2025-01-15
- [ ] Third task #Tasks/Admin
`;

const tasks = parseArray(tasksText);
console.log(tasks.length); // 3
console.log(tasks[0].content); // "First task"
console.log(tasks[1].state); // "completed"
```

### Stringifying Multiple Tasks

Use `stringifyArray` to convert multiple tasks back to a multiline string:

```typescript
import { stringifyArray } from 'taskmark';

const tasks = [
  {
    state: 'incomplete',
    content: 'First task',
    type: 'quick',
    tags: ['Tasks/Quick'],
    priority: 'normal',
  },
  {
    state: 'completed',
    content: 'Second task',
    type: 'main_mission',
    tags: ['Tasks/Main_Mission'],
    priority: 'normal',
  },
];

const tasksText = stringifyArray(tasks);
// Returns: "- [ ] First task #Tasks/Quick\n- [x] Second task #Tasks/Main_Mission"
```

## Understanding TaskMark Format

### Task Structure

A TaskMark task has this basic structure:

```
- [state] <focuses> <content> #Type #Scenarios <metadata>
```

**Example:**

```
- [ ] 🎯 Write quarterly report #Tasks/Main_Mission #Scenarios/Work 🌡️ high ⏱️ 90m 📅 2025-01-20 🔺
```

### Essential Components

**Task States** - Define the operational condition:
- `[ ]` incomplete (default)
- `[x]` completed
- `[/]` in progress
- `[-]` cancelled
- `[>]` forwarded
- And [10 more states](SPEC.md#_3-task-states)...

**Task Types** - Every task must have exactly one type:
- `#Tasks/Main_Mission` - Major project work
- `#Tasks/Quick` - Quick wins under 30 minutes
- `#Tasks/Maintenance` - Regular upkeep
- And [2 more types](SPEC.md#_4-task-types-mandatory-tag-max-one)...

**Focuses** - Visual indicators for task characteristics (optional, multiple allowed):
- 🎯 `critical` - High priority work
- 🧠 `hard_cognitive` - Requires deep thinking
- 🔥 `hyper_focus` - Ideal for flow state
- And [6 more focus types](SPEC.md#_5-focuses-zero-or-several)...

**Scenarios** - Context where task should be performed (optional, multiple allowed):

```typescript
const task = parse('- [ ] Task #Tasks/Quick #Scenarios/Work/Programming #Scenarios/Home');
console.log(task.scenarios); // ["Work/Programming", "Home"]
```

### Metadata Fields

**Energy & Duration:**

```typescript
// Energy levels: high, medium, low
const task1 = parse('- [ ] Task #Tasks/Quick 🌡️ high');

// Duration: 15m, 30m, 45m, 90m
const task2 = parse('- [ ] Task #Tasks/Quick ⏱️ 90m');
```

**Dates** - Six date types supported:

```typescript
const task = parse('- [ ] Task #Tasks/Quick 📅 2025-01-15 ✅ 2025-01-20');

console.log(task.dueAt);        // "2025-01-15"
console.log(task.completedAt);  // "2025-01-20"
```

Available date types: ➕ created, ⏳ scheduled, 🛫 start, 📅 due, ✅ completed, ❌ cancelled. [See all date types](SPEC.md#_10-dates).

**Priority:**

```typescript
const task = parse('- [ ] Task #Tasks/Quick 🔺');
console.log(task.priority); // "maximum"
```

Available: 🔺 maximum, ⏫ high, 🔼 medium, (default) normal, 🔽 low, ⏬ minimum

**Dependencies:**

```typescript
const task = parse('- [ ] Task #Tasks/Quick 🆔 task01 ⛔ task02 🏁 start:task03');

console.log(task.id);                    // "task01"
console.log(task.dependencies);         // ["task02"]
console.log(task.hooks?.onCompletion);  // ["start:task03"]
```

> 💡 **For complete details on all fields and options, see the [TaskMark-v1 Specification](SPEC.md)**

## Quick Utility Functions

TaskMark provides utility functions for modifying task strings without full parsing:

```typescript
import { markAsCompleted, setDueDate, setPriority, addFocus } from 'taskmark';

let task = '- [ ] Buy groceries #Tasks/Quick';

// Chain modifications
task = markAsCompleted(task, '2025-01-20');
// "- [x] Buy groceries #Tasks/Quick ✅ 2025-01-20"

task = setDueDate(task, '2025-01-25');
// "- [x] Buy groceries #Tasks/Quick ✅ 2025-01-20 📅 2025-01-25"

task = addFocus(task, 'critical');
// "- [x] 🎯 Buy groceries #Tasks/Quick ✅ 2025-01-20 📅 2025-01-25"
```

Available utilities: `markAsCompleted`, `markAsIncomplete`, `setDueDate`, `setPriority`, `addFocus`, `addTag`, `setEnergy`, `setDuration`

## Internationalization

TaskMark supports custom tag mappings for different languages:

```typescript
import { parse, stringify } from 'taskmark';

// Spanish configuration example
const config = {
  typeTagMapping: {
    'Tareas/Mision_Principal': 'main_mission',
    'Tareas/Rapida': 'quick',
  },
  scenarioPrefix: 'Escenarios/',
};

const task = parse('- [ ] 🎯 Implementar login #Tareas/Mision_Principal', config);
console.log(task.type); // "main_mission"
```

## TypeScript Support

TaskMark is fully typed:

```typescript
import type { Task, TaskState, TaskType, Focus, Energy, Priority } from 'taskmark';

const task: Task = {
  state: 'incomplete',
  content: 'My task',
  type: 'quick',
  tags: ['Tasks/Quick'],
  priority: 'normal',
};
```

## Next Steps

- [API Reference](api.md) - Complete API documentation
- [TaskMark-v1 Specification](SPEC.md) - Full format specification and all fields
- [Contributing Guide](../CONTRIBUTING.md) - Learn how to contribute to the project
