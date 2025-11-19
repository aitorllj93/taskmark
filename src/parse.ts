import { TaskSchema } from "./schema";
import type {
	Duration,
	Energy,
	Focus,
	Priority,
	Task,
	TaskState,
	TaskType,
} from "./types";

// Mapping from symbols to descriptive state names
const STATE_SYMBOL_TO_NAME: Record<string, TaskState> = {
	" ": "incomplete",
	x: "completed",
	"/": "in_progress",
	"-": "cancelled",
	">": "forwarded",
	"<": "migrated",
	"@": "scheduled",
	"?": "question",
	"!": "important",
	"+": "add",
	R: "research",
	i: "idea",
	B: "brainstorm",
	L: "location_based",
	b: "bookmark",
};

// Mapping from focus emojis to descriptive focus names
const FOCUS_EMOJI_TO_NAME: Record<string, Focus> = {
	"🎯": "critical",
	"🔧": "mechanical",
	"🧹": "maintenance",
	"🔥": "hyper_focus",
	"🐢": "low_energy",
	"⚡": "high_energy",
	"🪓": "chunking",
	"📦": "errands",
	"🧠": "hard_cognitive",
};

// Set of focus emojis for O(1) lookup
const FOCUS_EMOJIS_SET = new Set(Object.keys(FOCUS_EMOJI_TO_NAME));

// Default mapping from task tags to task types
const DEFAULT_TYPE_TAG_MAPPING: Record<string, TaskType> = {
	"Tasks/Main_Mission": "main_mission",
	"Tasks/Secondary_Mission": "secondary_mission",
	"Tasks/Maintenance": "maintenance",
	"Tasks/Quick": "quick",
	"Tasks/Admin": "admin",
};

// Configuration interface for parse options
export interface ParseConfig<TScenario extends string = string> {
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

	/**
	 * Whether to validate the parsed task with Zod schema
	 * Default: true
	 * Set to false to skip validation for better performance
	 */
	validate?: boolean;
}

// Parse function
export function parse<TScenario extends string = string>(
	line: string,
	config?: ParseConfig<TScenario>,
): Omit<Task, "scenarios"> & { scenarios?: TScenario[] } {
	// Trim the line
	const trimmed = line.trim();

	// Extract state
	const stateMatch = trimmed.match(/^-\s*\[\s*(.?)\s*\]/);
	if (!stateMatch) {
		throw new Error("Invalid task format: missing state");
	}

	const stateSymbol = stateMatch[1] || " ";
	const state = STATE_SYMBOL_TO_NAME[stateSymbol];

	if (!state) {
		throw new Error(`Invalid task state symbol: ${stateSymbol}`);
	}

	let remaining = trimmed.slice(stateMatch[0].length).trim();

	// Extract focuses at the beginning
	const focuses: Focus[] = [];
	const focusSet = new Set<Focus>();

	// Convert to array of characters to properly handle emojis
	const chars = Array.from(remaining);
	let charIndex = 0;

	while (charIndex < chars.length) {
		const char = chars[charIndex];
		if (char && FOCUS_EMOJIS_SET.has(char)) {
			// Convert emoji to text using the mapping
			const focusName = FOCUS_EMOJI_TO_NAME[char];
			if (focusName && !focusSet.has(focusName)) {
				focuses.push(focusName);
				focusSet.add(focusName);
			}
			charIndex++;
			// Skip whitespace after emoji
			while (charIndex < chars.length && /\s/.test(chars[charIndex] || "")) {
				charIndex++;
			}
		} else {
			break;
		}
	}

	// Reconstruct remaining from the character array
	remaining = chars.slice(charIndex).join("");

	// Extract ALL tags (hashtags) from the line
	const tags: string[] = [];
	const tagMatches = remaining.matchAll(/#([^\s]+)/g);
	for (const match of tagMatches) {
		if (match[1]) tags.push(match[1]); // Store the tag without the # symbol
	}

	// Merge default and custom type tag mappings
	const typeTagMapping = {
		...DEFAULT_TYPE_TAG_MAPPING,
		...(config?.typeTagMapping || {}),
	};

	// Extract task type and scenarios in a single pass
	const scenarioPrefix = config?.scenarioPrefix || "Scenarios/";
	const scenarioMapping = config?.scenarioMapping || {};
	let type: TaskType | undefined;
	const scenarios: TScenario[] = [];

	for (const tag of tags) {
		// Check for task type first (break early if found)
		if (!type && typeTagMapping[tag]) {
			type = typeTagMapping[tag];
		}
		// Check for scenarios
		if (tag.startsWith(scenarioPrefix)) {
			// Check if there's a custom mapping for this scenario
			if (scenarioMapping[tag]) {
				scenarios.push(scenarioMapping[tag] as TScenario);
			} else {
				// Extract the scenario name after the prefix
				const scenarioName = tag.substring(scenarioPrefix.length);
				scenarios.push(scenarioName as TScenario);
			}
		}
	}

	// Extract additional focuses that appear after metadata but before dates
	// They can appear anywhere in the remaining text
	// Convert remaining to array once and reuse it
	const remainingChars = Array.from(remaining);
	for (let i = 0; i < remainingChars.length; i++) {
		const char = remainingChars[i];
		if (char && FOCUS_EMOJIS_SET.has(char)) {
			// Convert emoji to text using the mapping
			const focusName = FOCUS_EMOJI_TO_NAME[char];
			// Check if this focus is not already extracted
			if (focusName && !focusSet.has(focusName)) {
				focuses.push(focusName);
				focusSet.add(focusName);
			}
		}
	}

	// Extract energy
	let energy: Energy | undefined;
	const energyMatch = remaining.match(/🌡️\s*(high|medium|low)/);
	if (energyMatch) {
		energy = energyMatch[1] as Energy;
	}

	// Extract duration
	let duration: Duration | undefined;
	const durationMatch = remaining.match(
		/⏱️\s*(\d+(?:\.\d+)?(?:ms|s|m|h|d|w|y))/i,
	);
	if (durationMatch?.[1]) {
		duration = durationMatch[1];
	}

	// Extract blocking
	const blocking = remaining.includes("🔒");

	// Extract dates (with "At" suffix)
	let createdAt: string | undefined;
	let scheduledAt: string | undefined;
	let startedAt: string | undefined;
	let dueAt: string | undefined;
	let completedAt: string | undefined;
	let cancelledAt: string | undefined;

	const createdMatch = remaining.match(/➕\s*(\d{4}-\d{2}-\d{2})/);
	if (createdMatch?.[1]) createdAt = createdMatch[1];

	const scheduledMatch = remaining.match(/⏳\s*(\d{4}-\d{2}-\d{2})/);
	if (scheduledMatch?.[1]) scheduledAt = scheduledMatch[1];

	const startMatch = remaining.match(/🛫\s*(\d{4}-\d{2}-\d{2})/);
	if (startMatch?.[1]) startedAt = startMatch[1];

	const dueMatch = remaining.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
	if (dueMatch?.[1]) dueAt = dueMatch[1];

	const completionMatch = remaining.match(/✅\s*(\d{4}-\d{2}-\d{2})/);
	if (completionMatch?.[1]) completedAt = completionMatch[1];

	const cancellationMatch = remaining.match(/❌\s*(\d{4}-\d{2}-\d{2})/);
	if (cancellationMatch?.[1]) cancelledAt = cancellationMatch[1];

	// Extract time
	let time: { start: string; end: string } | undefined;
	const timeMatch = remaining.match(
		/⏰\s*\[(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\]/,
	);
	if (timeMatch?.[1] && timeMatch?.[2]) {
		time = { start: timeMatch[1], end: timeMatch[2] };
	}

	// Extract priority
	let priority: Priority | undefined;
	if (remaining.includes("🔺")) priority = "maximum";
	else if (remaining.includes("⏫")) priority = "high";
	else if (remaining.includes("🔼")) priority = "medium";
	else if (remaining.includes("🔽")) priority = "low";
	else if (remaining.includes("⏬")) priority = "minimum";
	// Only set 'normal' as default when validation is enabled and other fields exist
	// Otherwise leave it undefined to match the markdown standard

	// Extract recurrence
	let recurrence: string | undefined;
	const recurrenceMatch = remaining.match(
		/🔁\s*([^\n]+?)(?=\s*(?:🆔|⛔|🏁|$))/,
	);
	if (recurrenceMatch?.[1]) {
		recurrence = recurrenceMatch[1].trim();
	}

	// Extract id
	let id: string | undefined;
	const idMatch = remaining.match(/🆔\s*([a-zA-Z0-9]+)/);
	if (idMatch?.[1]) id = idMatch[1];

	// Extract dependencies (previously blockedBy)
	const dependencies: string[] = [];
	const dependencyMatches = remaining.matchAll(/⛔\s*([a-zA-Z0-9]+)/g);
	for (const match of dependencyMatches) {
		if (match[1]) dependencies.push(match[1]);
	}

	// Extract hooks
	const onCompletion: string[] = [];
	const onCompletionMatches = remaining.matchAll(/🏁\s*([a-zA-Z0-9:]+)/g);
	for (const match of onCompletionMatches) {
		if (match[1]) onCompletion.push(match[1]);
	}

	// Extract content (everything that's not metadata)
	let content = remaining;

	// Remove all metadata from content
	content = content.replace(/#[^\s]+/g, ""); // Remove all hashtags
	content = content.replace(/🌡️\s*(high|medium|low)/g, "");
	content = content.replace(/⏱️\s*\d+(?:\.\d+)?(?:ms|s|m|h|d|w|y)/gi, "");
	content = content.replace(/🔒/g, "");
	content = content.replace(/➕\s*\d{4}-\d{2}-\d{2}/g, "");
	content = content.replace(/⏳\s*\d{4}-\d{2}-\d{2}/g, "");
	content = content.replace(/🛫\s*\d{4}-\d{2}-\d{2}/g, "");
	content = content.replace(/📅\s*\d{4}-\d{2}-\d{2}/g, "");
	content = content.replace(/✅\s*\d{4}-\d{2}-\d{2}/g, "");
	content = content.replace(/❌\s*\d{4}-\d{2}-\d{2}/g, "");
	content = content.replace(/⏰\s*\[\d{2}:\d{2}\s*-\s*\d{2}:\d{2}\]/g, "");
	content = content.replace(/🔺|⏫|🔼|🔽|⏬/g, "");
	content = content.replace(/🔁\s*[^\n]+?(?=\s*(?:🆔|⛔|🏁|$))/g, "");
	content = content.replace(/🆔\s*[a-zA-Z0-9]+/g, "");
	content = content.replace(/⛔\s*[a-zA-Z0-9]+/g, "");
	content = content.replace(/🏁\s*[a-zA-Z0-9:]+/g, "");

	// Remove focus emojis that might appear in the middle or end
	// Use Set for O(1) lookup instead of array.includes() which is O(n)
	const contentChars = Array.from(content);
	const filteredContent = contentChars
		.filter((char) => !FOCUS_EMOJIS_SET.has(char))
		.join("");
	content = filteredContent.trim();

	if (!content) {
		throw new Error("Invalid task format: empty content");
	}

	// Build the task object
	const task: Partial<Task> & {
		state: TaskState;
		content: string;
	} = {
		state,
		content,
		tags, // Always include tags (as array, even if empty)
	};

	if (type) task.type = type;
	if (priority) task.priority = priority;
	if (id) task.id = id;
	if (focuses.length > 0) task.focuses = focuses;
	if (scenarios.length > 0) task.scenarios = scenarios;
	if (energy) task.energy = energy;
	if (duration) task.duration = duration;
	if (blocking) task.blocking = blocking;
	if (createdAt) task.createdAt = createdAt;
	if (scheduledAt) task.scheduledAt = scheduledAt;
	if (startedAt) task.startedAt = startedAt;
	if (dueAt) task.dueAt = dueAt;
	if (completedAt) task.completedAt = completedAt;
	if (cancelledAt) task.cancelledAt = cancelledAt;
	if (time) task.time = time;
	if (recurrence) task.recurrence = recurrence;
	if (dependencies.length > 0) task.dependencies = dependencies;
	if (onCompletion.length > 0) task.hooks = { onCompletion };

	// Validate with Zod (unless explicitly disabled)
	const shouldValidate = config?.validate !== false;
	if (shouldValidate) {
		return TaskSchema.parse(task) as Omit<Task, "scenarios"> & {
			scenarios?: TScenario[];
		};
	}

	return task as Omit<Task, "scenarios"> & {
		scenarios?: TScenario[];
	};
}

/**
 * Parse multiple tasks from a multiline string
 * @param text Multiline string containing multiple tasks (one per line)
 * @param config Optional configuration for parse
 * @returns Array of parsed tasks
 */
export function parseArray<TScenario extends string = string>(
	text: string,
	config?: ParseConfig<TScenario>,
): Array<Omit<Task, "scenarios"> & { scenarios?: TScenario[] }> {
	const lines = text
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);
	return lines.map((line) => parse(line, config));
}
