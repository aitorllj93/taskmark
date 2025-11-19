import { z } from "zod";

// Task State enum - using descriptive names
export const TaskStateSchema = z.enum([
	"incomplete",
	"completed",
	"in_progress",
	"cancelled",
	"forwarded",
	"migrated",
	"scheduled",
	"question",
	"important",
	"add",
	"research",
	"idea",
	"brainstorm",
	"location_based",
	"bookmark",
]);

// Task Type enum - using descriptive names
export const TaskTypeSchema = z.enum([
	"main_mission",
	"secondary_mission",
	"maintenance",
	"quick",
	"admin",
]);

// Focus enum
export const FocusSchema = z.enum([
	"critical", // 🎯 Critical task
	"mechanical", // 🔧 Mechanical task
	"maintenance", // 🧹 Maintenance
	"hyper_focus", // 🔥 Hyper-focus ideal
	"low_energy", // 🐢 Low energy
	"high_energy", // ⚡ High energy
	"chunking", // 🪓 Chunking
	"errands", // 📦 Errands
	"hard_cognitive", // 🧠 Hard cognitive task
]);

// Energy level enum
export const EnergySchema = z.enum(["high", "medium", "low"]);

// Duration as string (e.g., "15m", "90m", "2h")
export const DurationSchema = z
	.string()
	.regex(/^\d+(?:\.\d+)?(?:ms|s|m|h|d|w|y)$/i);

// Priority enum
export const PrioritySchema = z.enum([
	"maximum", // 🔺
	"high", // ⏫
	"medium", // 🔼
	"normal", // no emoji
	"low", // 🔽
	"minimum", // ⏬
]);

// Date schema for individual date fields
export const DateFieldSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/)
	.optional();

// Time range
export const TimeSchema = z.object({
	start: z.string().regex(/^\d{2}:\d{2}$/),
	end: z.string().regex(/^\d{2}:\d{2}$/),
});

// Hooks
export const HooksSchema = z.object({
	onCompletion: z.array(z.string()).optional(), // 🏁
});

// Main Task schema
export const TaskSchema = z.object({
	state: TaskStateSchema,
	content: z.string().min(1),
	type: TaskTypeSchema.optional(),
	tags: z.array(z.string()).optional(),
	id: z.string().optional(),
	focuses: z.array(FocusSchema).optional(),
	scenarios: z.array(z.string()).optional(),
	energy: EnergySchema.optional(),
	duration: DurationSchema.optional(),
	blocking: z.boolean().optional(),
	// Date fields (moved to root with "At" suffix)
	createdAt: DateFieldSchema,
	scheduledAt: DateFieldSchema,
	startedAt: DateFieldSchema,
	dueAt: DateFieldSchema,
	completedAt: DateFieldSchema,
	cancelledAt: DateFieldSchema,
	time: TimeSchema.optional(),
	priority: PrioritySchema.optional(),
	recurrence: z.string().optional(),
	dependencies: z.array(z.string()).optional(),
	hooks: HooksSchema.optional(),
});

/**
 * Validates a task object against the TaskSchema
 * @param task The task object to validate
 * @returns true if the task is valid, false otherwise
 */
export function validateTask(task: unknown): boolean {
	return TaskSchema.safeParse(task).success;
}

/**
 * Type guard that validates a task object
 * @param task The task object to validate
 * @returns true if the task is valid (narrows type to Task)
 */
export function isValidTask(task: unknown): task is z.infer<typeof TaskSchema> {
	return TaskSchema.safeParse(task).success;
}

/**
 * Validates a task and returns detailed error information if invalid
 * @param task The task object to validate
 * @returns Success result with data or error result with issues
 */
export function validateTaskWithErrors(
	task: unknown,
): ReturnType<typeof TaskSchema.safeParse> {
	return TaskSchema.safeParse(task);
}
