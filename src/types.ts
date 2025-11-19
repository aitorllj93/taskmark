import type z from "zod";
import type {
	DurationSchema,
	EnergySchema,
	FocusSchema,
	PrioritySchema,
	TaskStateSchema,
	TaskTypeSchema,
} from "./schema";

/**
 * Task state values and their corresponding markdown symbols
 * @example
 * - [ ] incomplete
 * - [x] completed
 * - [/] in_progress
 * - [-] cancelled
 * - [>] forwarded
 * - [<] migrated
 * - [@] scheduled
 * - [?] question
 * - [!] important
 * - [+] add
 * - [R] research
 * - [i] idea
 * - [B] brainstorm
 * - [L] location_based
 * - [b] bookmark
 */
export type TaskState = z.infer<typeof TaskStateSchema>;

/**
 * Task type values and their corresponding tags
 * @example
 * #Tasks/Main_Mission → main_mission
 * #Tasks/Secondary_Mission → secondary_mission
 * #Tasks/Maintenance → maintenance
 * #Tasks/Quick → quick
 * #Tasks/Admin → admin
 */
export type TaskType = z.infer<typeof TaskTypeSchema>;

/**
 * Focus values and their corresponding emojis
 * @example
 * 🎯 critical
 * 🔧 mechanical
 * 🧹 maintenance
 * 🔥 hyper_focus
 * 🐢 low_energy
 * ⚡ high_energy
 * 🪓 chunking
 * 📦 errands
 * 🧠 hard_cognitive
 */
export type Focus = z.infer<typeof FocusSchema>;

/**
 * Energy level values
 * @example
 * 🌡️ high | medium | low
 */
export type Energy = z.infer<typeof EnergySchema>;

/**
 * Duration format (e.g., "15m", "90m", "2h")
 * @example
 * ⏱️ 15m
 * ⏱️ 2h
 * ⏱️ 30s
 */
export type Duration = z.infer<typeof DurationSchema>;

/**
 * Priority values and their corresponding emojis
 * @example
 * 🔺 maximum
 * ⏫ high
 * 🔼 medium
 * (no emoji) normal
 * 🔽 low
 * ⏬ minimum
 */
export type Priority = z.infer<typeof PrioritySchema>;

/**
 * Main Task type with all properties documented
 */
export interface Task {
	/**
	 * Current state of the task
	 * @example
	 * Parsed from: - [x] Task content
	 * Symbols: [ ] x / - > < @ ? ! + R i B L b
	 */
	state: TaskState;

	/**
	 * The main text content of the task (everything that's not metadata)
	 * @example
	 * Parsed from: - [ ] Buy groceries #Tasks/Quick
	 * Content: "Buy groceries"
	 */
	content: string;

	/**
	 * Type/category of the task
	 * @example
	 * Parsed from: #Tasks/Main_Mission
	 *
	 * Default mappings:
	 * - #Tasks/Main_Mission → main_mission
	 * - #Tasks/Secondary_Mission → secondary_mission
	 * - #Tasks/Maintenance → maintenance
	 * - #Tasks/Quick → quick
	 * - #Tasks/Admin → admin
	 *
	 * Can be customized via ParseConfig.typeTagMapping:
	 * @example
	 * parse(line, {
	 *   typeTagMapping: {
	 *     "Tareas/Mision_Principal": "main_mission",
	 *     "Tareas/Rapida": "quick"
	 *   }
	 * })
	 */
	type?: TaskType;

	/**
	 * List of tags associated with the task (includes type, scenario, and custom tags)
	 * @example
	 * Parsed from: #Tasks/Quick #work #urgent
	 * Tags: ["Tasks/Quick", "work", "urgent"]
	 */
	tags?: string[];

	/**
	 * Unique identifier for the task
	 * @example
	 * Parsed from: 🆔 task123
	 */
	id?: string;

	/**
	 * List of focus types for the task
	 * @example
	 * Parsed from: 🎯🔥 Task content
	 * Focuses: ["critical", "hyper_focus"]
	 */
	focuses?: Focus[];

	/**
	 * List of scenarios where this task applies
	 * @example
	 * Parsed from: #Scenarios/work #Scenarios/home
	 * Scenarios: ["work", "home"]
	 *
	 * Default prefix: "Scenarios/"
	 *
	 * Can be customized via ParseConfig:
	 * @example
	 * // Custom prefix
	 * parse(line, {
	 *   scenarioPrefix: "Escenarios/"
	 * })
	 * // #Escenarios/trabajo → ["trabajo"]
	 *
	 * // Custom mapping
	 * parse(line, {
	 *   scenarioMapping: {
	 *     "Scenarios/work": "trabajo",
	 *     "Scenarios/home": "casa"
	 *   }
	 * })
	 * // #Scenarios/work → ["trabajo"]
	 */
	scenarios?: string[];

	/**
	 * Energy level required for the task
	 * @example
	 * Parsed from: 🌡️ high
	 */
	energy?: Energy;

	/**
	 * Estimated duration of the task
	 * @example
	 * Parsed from: ⏱️ 30m
	 */
	duration?: Duration;

	/**
	 * Whether this task blocks other tasks
	 * @example
	 * Parsed from: 🔒
	 */
	blocking?: boolean;

	/**
	 * Date when the task was created
	 * @example
	 * Parsed from: ➕ 2024-01-15
	 * Format: YYYY-MM-DD
	 */
	createdAt?: string;

	/**
	 * Date when the task is scheduled
	 * @example
	 * Parsed from: ⏳ 2024-01-20
	 * Format: YYYY-MM-DD
	 */
	scheduledAt?: string;

	/**
	 * Date when the task was started
	 * @example
	 * Parsed from: 🛫 2024-01-18
	 * Format: YYYY-MM-DD
	 */
	startedAt?: string;

	/**
	 * Date when the task is due
	 * @example
	 * Parsed from: 📅 2024-01-25
	 * Format: YYYY-MM-DD
	 */
	dueAt?: string;

	/**
	 * Date when the task was completed
	 * @example
	 * Parsed from: ✅ 2024-01-22
	 * Format: YYYY-MM-DD
	 */
	completedAt?: string;

	/**
	 * Date when the task was cancelled
	 * @example
	 * Parsed from: ❌ 2024-01-23
	 * Format: YYYY-MM-DD
	 */
	cancelledAt?: string;

	/**
	 * Time range for the task
	 * @example
	 * Parsed from: ⏰ [09:00-10:30]
	 */
	time?: {
		/** Start time in HH:MM format */
		start: string;
		/** End time in HH:MM format */
		end: string;
	};

	/**
	 * Priority level of the task (defaults to 'normal')
	 * @example
	 * Parsed from: 🔺 (maximum) ⏫ (high) 🔼 (medium) 🔽 (low) ⏬ (minimum)
	 */
	priority?: Priority;

	/**
	 * Recurrence pattern for the task
	 * @example
	 * Parsed from: 🔁 every monday
	 */
	recurrence?: string;

	/**
	 * List of task IDs that this task depends on (blocked by)
	 * @example
	 * Parsed from: ⛔ task1 ⛔ task2
	 * Dependencies: ["task1", "task2"]
	 */
	dependencies?: string[];

	/**
	 * Hooks that trigger actions when certain events occur
	 */
	hooks?: {
		/**
		 * Actions to execute when the task is completed
		 * @example
		 * Parsed from: 🏁 action1 🏁 action2
		 * onCompletion: ["action1", "action2"]
		 */
		onCompletion?: string[];
	};
}
