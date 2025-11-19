import type { Focus, Priority, Task, TaskState, TaskType } from './types';

// Mapping from state names to symbols
const STATE_NAME_TO_SYMBOL: Record<TaskState, string> = {
  incomplete: ' ',
  completed: 'x',
  in_progress: '/',
  cancelled: '-',
  forwarded: '>',
  migrated: '<',
  scheduled: '@',
  question: '?',
  important: '!',
  add: '+',
  research: 'R',
  idea: 'i',
  brainstorm: 'B',
  location_based: 'L',
  bookmark: 'b',
};

// Mapping from focus names to emojis
const FOCUS_NAME_TO_EMOJI: Record<Focus, string> = {
  critical: '🎯',
  mechanical: '🔧',
  maintenance: '🧹',
  hyper_focus: '🔥',
  low_energy: '🐢',
  high_energy: '⚡',
  chunking: '🪓',
  errands: '📦',
  hard_cognitive: '🧠',
};

// Default mapping from task types to tags
const DEFAULT_TYPE_TO_TAG: Record<TaskType, string> = {
  main_mission: 'Tasks/Main_Mission',
  secondary_mission: 'Tasks/Secondary_Mission',
  maintenance: 'Tasks/Maintenance',
  quick: 'Tasks/Quick',
  admin: 'Tasks/Admin',
};

// Mapping from priority names to emojis
const PRIORITY_TO_EMOJI: Record<Priority, string> = {
  maximum: '🔺',
  high: '⏫',
  medium: '🔼',
  normal: '',
  low: '🔽',
  minimum: '⏬',
};

// Configuration interface for stringify options
export interface StringifyConfig<TScenario extends string = string> {
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

export function stringify<TScenario extends string = string>(
  task: Task & { scenarios?: TScenario[] },
  config?: StringifyConfig<TScenario>
): string {
  const parts: string[] = [];

  // State
  const stateSymbol = STATE_NAME_TO_SYMBOL[task.state];
  parts.push(`- [${stateSymbol}]`);

  // Focuses at the beginning
  if (task.focuses && task.focuses.length > 0) {
    const focusEmojis = task.focuses.map((focus) => FOCUS_NAME_TO_EMOJI[focus]).join('');
    parts.push(focusEmojis);
  }

  // Content
  parts.push(task.content);

  // Tags (type tag + all other tags including scenarios)
  const tags: string[] = [];

  // Get type tag mapping (use custom if provided, otherwise default)
  const typeToTag = config?.typeTagMapping || DEFAULT_TYPE_TO_TAG;
  const typeTag = typeToTag[task.type];
  tags.push(`#${typeTag}`);

  // Handle scenarios with custom prefix and mapping
  const scenarioPrefix = config?.scenarioPrefix || 'Scenarios/';
  const scenarioMapping = config?.scenarioMapping;

  // Track which scenario tags we've added from normalized scenarios
  const addedScenarioTags = new Set<string>();

  if (task.scenarios && task.scenarios.length > 0) {
    for (const scenario of task.scenarios) {
      // Check if there's a custom mapping for this scenario
      const scenarioKey = scenario as TScenario;
      const scenarioTag = scenarioMapping?.[scenarioKey];
      if (scenarioTag) {
        tags.push(`#${scenarioTag}`);
        addedScenarioTags.add(scenarioTag);
      } else {
        // Use prefix + scenario name
        const scenarioTagGenerated = `${scenarioPrefix}${scenario}`;
        tags.push(`#${scenarioTagGenerated}`);
        addedScenarioTags.add(scenarioTagGenerated);
      }
    }
  }

  // Add all other tags (custom tags, excluding type tag and scenario tags already added)
  const typeTagWithoutHash = typeTag;
  const defaultTypeTags = new Set(Object.values(DEFAULT_TYPE_TO_TAG));

  for (const tag of task.tags) {
    // Skip type tag if it matches (either default or custom)
    if (tag === typeTagWithoutHash) {
      continue;
    }
    // Skip scenario tags that we've already added from normalized scenarios
    if (addedScenarioTags.has(tag)) {
      continue;
    }
    // Skip default type tags that don't match the current type
    if (defaultTypeTags.has(tag) && tag !== typeTagWithoutHash) {
      continue;
    }
    // If we have normalized scenarios and this is a scenario tag, skip it
    // (we've already added it from normalized scenarios)
    if (task.scenarios && task.scenarios.length > 0) {
      const isDefaultScenarioTag = tag.startsWith('Scenarios/') && scenarioPrefix === 'Scenarios/';
      const isCustomScenarioTag = tag.startsWith(scenarioPrefix) && scenarioPrefix !== 'Scenarios/';
      if (isDefaultScenarioTag || isCustomScenarioTag) {
        continue;
      }
    }
    tags.push(`#${tag}`);
  }

  if (tags.length > 0) {
    parts.push(...tags);
  }

  // Energy
  if (task.energy) {
    parts.push(`🌡️ ${task.energy}`);
  }

  // Duration
  if (task.duration) {
    parts.push(`⏱️ ${task.duration}`);
  }

  // Blocking
  if (task.blocking) {
    parts.push('🔒');
  }

  // Priority (only if not normal)
  if (task.priority && task.priority !== 'normal') {
    parts.push(PRIORITY_TO_EMOJI[task.priority]);
  }

  // Dates
  if (task.createdAt) {
    parts.push(`➕ ${task.createdAt}`);
  }
  if (task.scheduledAt) {
    parts.push(`⏳ ${task.scheduledAt}`);
  }
  if (task.startedAt) {
    parts.push(`🛫 ${task.startedAt}`);
  }
  if (task.dueAt) {
    parts.push(`📅 ${task.dueAt}`);
  }
  if (task.completedAt) {
    parts.push(`✅ ${task.completedAt}`);
  }
  if (task.cancelledAt) {
    parts.push(`❌ ${task.cancelledAt}`);
  }

  // Time
  if (task.time) {
    parts.push(`⏰ [${task.time.start} - ${task.time.end}]`);
  }

  // Recurrence
  if (task.recurrence) {
    parts.push(`🔁 ${task.recurrence}`);
  }

  // ID
  if (task.id) {
    parts.push(`🆔 ${task.id}`);
  }

  // Dependencies
  if (task.dependencies && task.dependencies.length > 0) {
    for (const dep of task.dependencies) {
      parts.push(`⛔ ${dep}`);
    }
  }

  // Hooks
  if (task.hooks?.onCompletion && task.hooks.onCompletion.length > 0) {
    for (const hook of task.hooks.onCompletion) {
      parts.push(`🏁 ${hook}`);
    }
  }

  return parts.join(' ');
}

/**
 * Stringify an array of tasks, joining them with newlines
 * @param tasks Array of tasks to stringify
 * @param config Optional configuration for stringify
 * @returns String with each task on a separate line
 */
export function stringifyArray<TScenario extends string = string>(
  tasks: Array<Task & { scenarios?: TScenario[] }>,
  config?: StringifyConfig<TScenario>
): string {
  return tasks.map((task) => stringify(task, config)).join('\n');
}
