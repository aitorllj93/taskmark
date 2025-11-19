/**
 * Utility functions for modifying task strings without full parsing
 */

/**
 * Marks a task as completed by changing its state to [x]
 * Optionally adds or updates the completion date
 *
 * @param taskString - The task string to modify
 * @param completedDate - Optional completion date in YYYY-MM-DD format. If not provided, uses today's date
 * @returns The modified task string
 *
 * @example
 * ```ts
 * markAsCompleted('- [ ] Buy groceries #Tasks/Quick')
 * // Returns: '- [x] Buy groceries #Tasks/Quick ✅ 2025-01-15'
 *
 * markAsCompleted('- [ ] Buy groceries #Tasks/Quick', '2025-01-20')
 * // Returns: '- [x] Buy groceries #Tasks/Quick ✅ 2025-01-20'
 * ```
 */
export function markAsCompleted(
	taskString: string,
	completedDate?: string,
): string {
	// Get completion date (use provided or today's date)
	const date = completedDate || new Date().toISOString().split("T")[0];

	// Replace state with [x]
	let result = taskString.replace(/^-\s*\[\s*[^\]]*\s*\]/, "- [x]");

	// Remove existing completion date if present
	result = result.replace(/\s*✅\s*\d{4}-\d{2}-\d{2}/g, "");

	// Add completion date at the end (before any dependencies/hooks)
	// Find the position before 🆔, ⛔, or 🏁 if they exist
	const idMatch = result.match(/\s*🆔/);
	const depMatch = result.match(/\s*⛔/);
	const hookMatch = result.match(/\s*🏁/);

	if (idMatch || depMatch || hookMatch) {
		// Insert before the first dependency/hook/id marker
		const positions = [
			idMatch && idMatch.index !== undefined
				? idMatch.index
				: Number.POSITIVE_INFINITY,
			depMatch && depMatch.index !== undefined
				? depMatch.index
				: Number.POSITIVE_INFINITY,
			hookMatch && hookMatch.index !== undefined
				? hookMatch.index
				: Number.POSITIVE_INFINITY,
		];
		const insertPos = Math.min(...positions);
		result = `${result.slice(0, insertPos)} ✅ ${date}${result.slice(insertPos)}`;
	} else {
		// Append at the end
		result = `${result.trim()} ✅ ${date}`;
	}

	return result;
}

/**
 * Sets or updates the scheduled date for a task
 *
 * @param taskString - The task string to modify
 * @param date - The scheduled date in YYYY-MM-DD format
 * @returns The modified task string
 *
 * @example
 * ```ts
 * setScheduledDate('- [ ] Buy groceries #Tasks/Quick', '2025-01-20')
 * // Returns: '- [ ] Buy groceries #Tasks/Quick ⏳ 2025-01-20'
 *
 * setScheduledDate('- [ ] Task #Tasks/Quick ⏳ 2025-01-15', '2025-01-20')
 * // Returns: '- [ ] Task #Tasks/Quick ⏳ 2025-01-20' (replaces existing)
 * ```
 */
export function setScheduledDate(taskString: string, date: string): string {
	// Validate date format (YYYY-MM-DD)
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		throw new Error(`Invalid date format. Expected YYYY-MM-DD, got: ${date}`);
	}

	// Remove existing scheduled date if present
	let result = taskString.replace(/\s*⏳\s*\d{4}-\d{2}-\d{2}/g, "");

	// Find the position to insert the scheduled date
	// It should go after dates but before other metadata
	// Order: dates come after tags, energy, duration, blocking, priority
	// But before recurrence, id, dependencies, hooks

	// Check if there are other dates to maintain order
	const datePatterns = [
		{ pattern: /➕\s*\d{4}-\d{2}-\d{2}/, name: "created" },
		{ pattern: /🛫\s*\d{4}-\d{2}-\d{2}/, name: "started" },
		{ pattern: /📅\s*\d{4}-\d{2}-\d{2}/, name: "due" },
		{ pattern: /✅\s*\d{4}-\d{2}-\d{2}/, name: "completed" },
		{ pattern: /❌\s*\d{4}-\d{2}-\d{2}/, name: "cancelled" },
	];

	// Find the last date position
	let lastDatePos = -1;
	for (const { pattern } of datePatterns) {
		const match = result.match(pattern);
		if (match && match.index !== undefined && match.index > lastDatePos) {
			lastDatePos = match.index + match[0].length;
		}
	}

	if (lastDatePos >= 0) {
		// Insert after the last date
		result = `${result.slice(0, lastDatePos)} ⏳ ${date}${result.slice(lastDatePos)}`;
		return result.trim();
	}
	// No other dates, find a good insertion point
	// Insert after priority, blocking, duration, energy, tags
	// But before recurrence, id, dependencies, hooks
	const beforePatterns = [/\s*🔁/, /\s*🆔/, /\s*⛔/, /\s*🏁/];

	let insertPos = result.length;
	for (const pattern of beforePatterns) {
		const match = result.match(pattern);
		if (match && match.index !== undefined && match.index < insertPos) {
			insertPos = match.index;
		}
	}

	result = `${result.slice(0, insertPos)} ⏳ ${date}${result.slice(insertPos)}`;

	return result.trim();
}

/**
 * Removes the scheduled date from a task
 *
 * @param taskString - The task string to modify
 * @returns The modified task string with scheduled date removed
 *
 * @example
 * ```ts
 * removeScheduledDate('- [ ] Task #Tasks/Quick ⏳ 2025-01-20')
 * // Returns: '- [ ] Task #Tasks/Quick'
 * ```
 */
export function removeScheduledDate(taskString: string): string {
	return taskString.replace(/\s*⏳\s*\d{4}-\d{2}-\d{2}/g, "").trim();
}

/**
 * Marks a task as incomplete by changing its state to [ ]
 *
 * @param taskString - The task string to modify
 * @returns The modified task string
 *
 * @example
 * ```ts
 * markAsIncomplete('- [x] Buy groceries #Tasks/Quick')
 * // Returns: '- [ ] Buy groceries #Tasks/Quick'
 * ```
 */
export function markAsIncomplete(taskString: string): string {
	return taskString.replace(/^-\s*\[\s*[^\]]*\s*\]/, "- [ ]");
}

// Mapping from state names to symbols
const STATE_NAME_TO_SYMBOL: Record<string, string> = {
	incomplete: " ",
	completed: "x",
	in_progress: "/",
	cancelled: "-",
	forwarded: ">",
	migrated: "<",
	scheduled: "@",
	question: "?",
	important: "!",
	add: "+",
	research: "R",
	idea: "i",
	brainstorm: "B",
	location_based: "L",
	bookmark: "b",
};

// Mapping from focus names to emojis
const FOCUS_NAME_TO_EMOJI: Record<string, string> = {
	critical: "🎯",
	mechanical: "🔧",
	maintenance: "🧹",
	hyper_focus: "🔥",
	low_energy: "🐢",
	high_energy: "⚡",
	chunking: "🪓",
	errands: "📦",
	hard_cognitive: "🧠",
};

// Mapping from priority names to emojis
const PRIORITY_TO_EMOJI: Record<string, string> = {
	maximum: "🔺",
	high: "⏫",
	medium: "🔼",
	normal: "",
	low: "🔽",
	minimum: "⏬",
};

/**
 * Sets the task state to a specific state
 *
 * @param taskString - The task string to modify
 * @param state - The new state (e.g., 'completed', 'in_progress', 'cancelled')
 * @returns The modified task string
 *
 * @example
 * ```ts
 * setState('- [ ] Task #Tasks/Quick', 'in_progress')
 * // Returns: '- [/] Task #Tasks/Quick'
 *
 * setState('- [x] Task #Tasks/Quick', 'cancelled')
 * // Returns: '- [-] Task #Tasks/Quick'
 * ```
 */
export function setState(taskString: string, state: string): string {
	const symbol = STATE_NAME_TO_SYMBOL[state];
	if (!symbol) {
		throw new Error(
			`Invalid state: ${state}. Valid states: ${Object.keys(STATE_NAME_TO_SYMBOL).join(", ")}`,
		);
	}
	return taskString.replace(/^-\s*\[\s*[^\]]*\s*\]/, `- [${symbol}]`);
}

/**
 * Sets or updates the due date for a task
 *
 * @param taskString - The task string to modify
 * @param date - The due date in YYYY-MM-DD format
 * @returns The modified task string
 *
 * @example
 * ```ts
 * setDueDate('- [ ] Task #Tasks/Quick', '2025-01-20')
 * // Returns: '- [ ] Task #Tasks/Quick 📅 2025-01-20'
 * ```
 */
export function setDueDate(taskString: string, date: string): string {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		throw new Error(`Invalid date format. Expected YYYY-MM-DD, got: ${date}`);
	}

	let result = taskString.replace(/\s*📅\s*\d{4}-\d{2}-\d{2}/g, "");
	result = insertDate(result, `📅 ${date}`);
	return result.trim();
}

/**
 * Removes the due date from a task
 *
 * @param taskString - The task string to modify
 * @returns The modified task string
 */
export function removeDueDate(taskString: string): string {
	return taskString.replace(/\s*📅\s*\d{4}-\d{2}-\d{2}/g, "").trim();
}

/**
 * Sets or updates the started date for a task
 *
 * @param taskString - The task string to modify
 * @param date - The started date in YYYY-MM-DD format
 * @returns The modified task string
 */
export function setStartedDate(taskString: string, date: string): string {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		throw new Error(`Invalid date format. Expected YYYY-MM-DD, got: ${date}`);
	}

	let result = taskString.replace(/\s*🛫\s*\d{4}-\d{2}-\d{2}/g, "");
	result = insertDate(result, `🛫 ${date}`);
	return result.trim();
}

/**
 * Removes the started date from a task
 *
 * @param taskString - The task string to modify
 * @returns The modified task string
 */
export function removeStartedDate(taskString: string): string {
	return taskString.replace(/\s*🛫\s*\d{4}-\d{2}-\d{2}/g, "").trim();
}

/**
 * Sets or updates the priority for a task
 *
 * @param taskString - The task string to modify
 * @param priority - The priority level ('maximum', 'high', 'medium', 'normal', 'low', 'minimum')
 * @returns The modified task string
 *
 * @example
 * ```ts
 * setPriority('- [ ] Task #Tasks/Quick', 'high')
 * // Returns: '- [ ] Task #Tasks/Quick ⏫'
 * ```
 */
export function setPriority(taskString: string, priority: string): string {
	// Remove all existing priority emojis
	let result = taskString.replace(/\s*[🔺⏫🔼🔽⏬]/gu, "");

	const emoji = PRIORITY_TO_EMOJI[priority];
	if (emoji === undefined) {
		throw new Error(
			`Invalid priority: ${priority}. Valid priorities: ${Object.keys(PRIORITY_TO_EMOJI).join(", ")}`,
		);
	}

	// If normal, just return without adding anything
	if (priority === "normal") {
		return result.trim();
	}

	// Insert priority after blocking, duration, energy, tags, but before dates
	const beforePatterns = [
		/\s*➕/,
		/\s*⏳/,
		/\s*🛫/,
		/\s*📅/,
		/\s*✅/,
		/\s*❌/,
		/\s*⏰/,
		/\s*🔁/,
		/\s*🆔/,
		/\s*⛔/,
		/\s*🏁/,
	];

	let insertPos = result.length;
	for (const pattern of beforePatterns) {
		const match = result.match(pattern);
		if (match && match.index !== undefined && match.index < insertPos) {
			insertPos = match.index;
		}
	}

	result = `${result.slice(0, insertPos)} ${emoji}${result.slice(insertPos)}`;
	return result.trim();
}

/**
 * Sets or updates the energy level for a task
 *
 * @param taskString - The task string to modify
 * @param energy - The energy level ('high', 'medium', 'low')
 * @returns The modified task string
 *
 * @example
 * ```ts
 * setEnergy('- [ ] Task #Tasks/Quick', 'high')
 * // Returns: '- [ ] Task #Tasks/Quick 🌡️ high'
 * ```
 */
export function setEnergy(taskString: string, energy: string): string {
	if (!["high", "medium", "low"].includes(energy)) {
		throw new Error(
			`Invalid energy: ${energy}. Valid values: high, medium, low`,
		);
	}

	let result = taskString.replace(/\s*🌡️\s*(high|medium|low)/g, "");
	result = insertMetadata(result, `🌡️ ${energy}`, [
		"⏱️",
		"🔒",
		"🔺",
		"⏫",
		"🔼",
		"🔽",
		"⏬",
	]);
	return result.trim();
}

/**
 * Removes the energy level from a task
 *
 * @param taskString - The task string to modify
 * @returns The modified task string
 */
export function removeEnergy(taskString: string): string {
	return taskString.replace(/\s*🌡️\s*(high|medium|low)/g, "").trim();
}

/**
 * Sets or updates the duration for a task
 *
 * @param taskString - The task string to modify
 * @param duration - The duration (e.g., '15m', '90m', '2h')
 * @returns The modified task string
 *
 * @example
 * ```ts
 * setDuration('- [ ] Task #Tasks/Quick', '30m')
 * // Returns: '- [ ] Task #Tasks/Quick ⏱️ 30m'
 * ```
 */
export function setDuration(taskString: string, duration: string): string {
	let result = taskString.replace(
		/\s*⏱️\s*\d+(?:\.\d+)?(?:ms|s|m|h|d|w|y)/gi,
		"",
	);
	result = insertMetadata(result, `⏱️ ${duration}`, [
		"🔒",
		"🔺",
		"⏫",
		"🔼",
		"🔽",
		"⏬",
	]);
	return result.trim();
}

/**
 * Removes the duration from a task
 *
 * @param taskString - The task string to modify
 * @returns The modified task string
 */
export function removeDuration(taskString: string): string {
	return taskString
		.replace(/\s*⏱️\s*\d+(?:\.\d+)?(?:ms|s|m|h|d|w|y)/gi, "")
		.trim();
}

/**
 * Sets or removes the blocking flag for a task
 *
 * @param taskString - The task string to modify
 * @param blocking - Whether the task should be blocking
 * @returns The modified task string
 *
 * @example
 * ```ts
 * setBlocking('- [ ] Task #Tasks/Quick', true)
 * // Returns: '- [ ] Task #Tasks/Quick 🔒'
 * ```
 */
export function setBlocking(taskString: string, blocking: boolean): string {
	if (blocking) {
		// Add blocking if not present
		if (!taskString.includes("🔒")) {
			let result = taskString;
			result = insertMetadata(result, "🔒", ["🔺", "⏫", "🔼", "🔽", "⏬"]);
			return result.trim();
		}
		return taskString;
	}
	// Remove blocking
	return taskString.replace(/\s*🔒/g, "").trim();
}

/**
 * Adds a focus emoji to a task
 *
 * @param taskString - The task string to modify
 * @param focus - The focus type ('critical', 'mechanical', 'maintenance', etc.)
 * @returns The modified task string
 *
 * @example
 * ```ts
 * addFocus('- [ ] Task #Tasks/Quick', 'critical')
 * // Returns: '- [ ] 🎯 Task #Tasks/Quick'
 * ```
 */
export function addFocus(taskString: string, focus: string): string {
	const emoji = FOCUS_NAME_TO_EMOJI[focus];
	if (!emoji) {
		throw new Error(
			`Invalid focus: ${focus}. Valid focuses: ${Object.keys(FOCUS_NAME_TO_EMOJI).join(", ")}`,
		);
	}

	// Check if focus already exists
	if (taskString.includes(emoji)) {
		return taskString;
	}

	// Find position after state and before content/tags
	const stateMatch = taskString.match(/^-\s*\[\s*[^\]]*\s*\]/);
	if (stateMatch && stateMatch.index !== undefined) {
		const afterState = stateMatch.index + stateMatch[0].length;
		// Find first tag or content start
		const tagMatch = taskString.match(/#/);
		const contentStart =
			tagMatch && tagMatch.index !== undefined
				? tagMatch.index
				: taskString.length;
		const insertPos = Math.min(afterState + 1, contentStart);
		return `${taskString.slice(0, insertPos)} ${emoji}${taskString.slice(insertPos)}`.trim();
	}

	return taskString;
}

/**
 * Removes a focus emoji from a task
 *
 * @param taskString - The task string to modify
 * @param focus - The focus type to remove
 * @returns The modified task string
 */
export function removeFocus(taskString: string, focus: string): string {
	const emoji = FOCUS_NAME_TO_EMOJI[focus];
	if (!emoji) {
		throw new Error(
			`Invalid focus: ${focus}. Valid focuses: ${Object.keys(FOCUS_NAME_TO_EMOJI).join(", ")}`,
		);
	}

	return taskString
		.replace(
			new RegExp(`\\s*${emoji.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g"),
			"",
		)
		.trim();
}

/**
 * Adds a tag to a task
 *
 * @param taskString - The task string to modify
 * @param tag - The tag to add (without #)
 * @returns The modified task string
 *
 * @example
 * ```ts
 * addTag('- [ ] Task #Tasks/Quick', 'urgent')
 * // Returns: '- [ ] Task #Tasks/Quick #urgent'
 * ```
 */
export function addTag(taskString: string, tag: string): string {
	// Check if tag already exists
	const tagRegex = new RegExp(
		`#${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\s|$)`,
		"g",
	);
	if (tagRegex.test(taskString)) {
		return taskString;
	}

	// Find position after last tag or before first metadata
	const metadataPatterns = [
		/\s*🌡️/,
		/\s*⏱️/,
		/\s*🔒/,
		/\s*🔺/,
		/\s*⏫/,
		/\s*🔼/,
		/\s*🔽/,
		/\s*⏬/,
		/\s*➕/,
		/\s*⏳/,
		/\s*🛫/,
		/\s*📅/,
		/\s*✅/,
		/\s*❌/,
		/\s*⏰/,
		/\s*🔁/,
		/\s*🆔/,
		/\s*⛔/,
		/\s*🏁/,
	];

	let insertPos = taskString.length;
	for (const pattern of metadataPatterns) {
		const match = taskString.match(pattern);
		if (match && match.index !== undefined && match.index < insertPos) {
			insertPos = match.index;
		}
	}

	return `${taskString.slice(0, insertPos)} #${tag}${taskString.slice(insertPos)}`;
}

/**
 * Removes a tag from a task
 *
 * @param taskString - The task string to modify
 * @param tag - The tag to remove (without #)
 * @returns The modified task string
 */
export function removeTag(taskString: string, tag: string): string {
	const tagRegex = new RegExp(
		`\\s*#${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\s|$)`,
		"g",
	);
	return taskString.replace(tagRegex, "").trim();
}

/**
 * Sets or updates the time range for a task
 *
 * @param taskString - The task string to modify
 * @param start - Start time in HH:MM format
 * @param end - End time in HH:MM format
 * @returns The modified task string
 *
 * @example
 * ```ts
 * setTimeRange('- [ ] Task #Tasks/Quick', '09:00', '10:30')
 * // Returns: '- [ ] Task #Tasks/Quick ⏰ [09:00 - 10:30]'
 * ```
 */
export function setTimeRange(
	taskString: string,
	start: string,
	end: string,
): string {
	if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) {
		throw new Error(
			`Invalid time format. Expected HH:MM, got: ${start} - ${end}`,
		);
	}

	let result = taskString.replace(
		/\s*⏰\s*\[\d{2}:\d{2}\s*-\s*\d{2}:\d{2}\]/g,
		"",
	);
	result = insertDate(result, `⏰ [${start} - ${end}]`);
	return result.trim();
}

/**
 * Removes the time range from a task
 *
 * @param taskString - The task string to modify
 * @returns The modified task string
 */
export function removeTimeRange(taskString: string): string {
	return taskString
		.replace(/\s*⏰\s*\[\d{2}:\d{2}\s*-\s*\d{2}:\d{2}\]/g, "")
		.trim();
}

/**
 * Adds a dependency to a task
 *
 * @param taskString - The task string to modify
 * @param taskId - The task ID this task depends on
 * @returns The modified task string
 *
 * @example
 * ```ts
 * addDependency('- [ ] Task #Tasks/Quick', 'task01')
 * // Returns: '- [ ] Task #Tasks/Quick ⛔ task01'
 * ```
 */
export function addDependency(taskString: string, taskId: string): string {
	// Check if dependency already exists
	const depRegex = new RegExp(
		`⛔\\s*${taskId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\s|$)`,
		"g",
	);
	if (depRegex.test(taskString)) {
		return taskString;
	}

	// Append dependency at the end (after hooks)
	return `${taskString.trim()} ⛔ ${taskId}`;
}

/**
 * Removes a dependency from a task
 *
 * @param taskString - The task string to modify
 * @param taskId - The task ID to remove from dependencies
 * @returns The modified task string
 */
export function removeDependency(taskString: string, taskId: string): string {
	const depRegex = new RegExp(
		`\\s*⛔\\s*${taskId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\s|$)`,
		"g",
	);
	return taskString.replace(depRegex, "").trim();
}

// Helper function to insert dates in the correct position
function insertDate(taskString: string, dateString: string): string {
	const datePatterns = [
		{ pattern: /➕\s*\d{4}-\d{2}-\d{2}/, name: "created" },
		{ pattern: /⏳\s*\d{4}-\d{2}-\d{2}/, name: "scheduled" },
		{ pattern: /🛫\s*\d{4}-\d{2}-\d{2}/, name: "started" },
		{ pattern: /📅\s*\d{4}-\d{2}-\d{2}/, name: "due" },
		{ pattern: /✅\s*\d{4}-\d{2}-\d{2}/, name: "completed" },
		{ pattern: /❌\s*\d{4}-\d{2}-\d{2}/, name: "cancelled" },
		{ pattern: /⏰\s*\[\d{2}:\d{2}\s*-\s*\d{2}:\d{2}\]/, name: "time" },
	];

	// Find the last date position
	let lastDatePos = -1;
	for (const { pattern } of datePatterns) {
		const match = taskString.match(pattern);
		if (match && match.index !== undefined && match.index > lastDatePos) {
			lastDatePos = match.index + match[0].length;
		}
	}

	if (lastDatePos >= 0) {
		return `${taskString.slice(0, lastDatePos)} ${dateString}${taskString.slice(lastDatePos)}`;
	}
	// No other dates, find insertion point before recurrence/id/dependencies/hooks
	const beforePatterns = [/\s*🔁/, /\s*🆔/, /\s*⛔/, /\s*🏁/];
	let insertPos = taskString.length;
	for (const pattern of beforePatterns) {
		const match = taskString.match(pattern);
		if (match && match.index !== undefined && match.index < insertPos) {
			insertPos = match.index;
		}
	}
	return `${taskString.slice(0, insertPos)} ${dateString}${taskString.slice(insertPos)}`;
}

// Helper function to insert metadata in the correct position
function insertMetadata(
	taskString: string,
	metadata: string,
	beforePatterns: string[],
): string {
	const patterns = beforePatterns.map(
		(p) => new RegExp(`\\s*${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
	);
	let insertPos = taskString.length;
	for (const pattern of patterns) {
		const match = taskString.match(pattern);
		if (match && match.index !== undefined && match.index < insertPos) {
			insertPos = match.index;
		}
	}
	return `${taskString.slice(0, insertPos)} ${metadata}${taskString.slice(insertPos)}`;
}
