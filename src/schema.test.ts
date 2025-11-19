import { describe, expect, it } from "vitest";
import { isValidTask, validateTask, validateTaskWithErrors } from "./schema";
import type { Task } from "./types";

describe("validateTask", () => {
	it("should return true for valid task", () => {
		const task: Task = {
			state: "incomplete",
			content: "Valid task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(validateTask(task)).toBe(true);
	});

	it("should return false for invalid task with wrong duration format", () => {
		const task = {
			state: "incomplete",
			content: "Invalid task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "invalid",
		};
		expect(validateTask(task)).toBe(false);
	});

	it("should return false for invalid task with wrong date format", () => {
		const task = {
			state: "incomplete",
			content: "Invalid task",
			type: "quick",
			tags: ["Tasks/Quick"],
			dueAt: "15-01-2025",
		};
		expect(validateTask(task)).toBe(false);
	});

	it("should return false for invalid task with wrong time format", () => {
		const task = {
			state: "incomplete",
			content: "Invalid task",
			type: "quick",
			tags: ["Tasks/Quick"],
			time: { start: "9:00", end: "10:30" },
		};
		expect(validateTask(task)).toBe(false);
	});

	it("should return false for task with empty content", () => {
		const task = {
			state: "incomplete",
			content: "",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(validateTask(task)).toBe(false);
	});

	it("should return true for task with all optional fields", () => {
		const task: Task = {
			state: "incomplete",
			content: "Complete task",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
			id: "task123",
			focuses: ["critical", "hyper_focus"],
			scenarios: ["work", "programming"],
			energy: "high",
			duration: "90m",
			blocking: true,
			createdAt: "2025-01-10",
			scheduledAt: "2025-01-11",
			startedAt: "2025-01-12",
			dueAt: "2025-01-15",
			completedAt: "2025-01-14",
			cancelledAt: undefined,
			time: { start: "09:00", end: "10:30" },
			priority: "maximum",
			recurrence: "every monday",
			dependencies: ["task001", "task002"],
			hooks: {
				onCompletion: ["action1", "action2"],
			},
		};
		expect(validateTask(task)).toBe(true);
	});
});

describe("isValidTask", () => {
	it("should work as a type guard", () => {
		const task: unknown = {
			state: "incomplete",
			content: "Valid task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};

		if (isValidTask(task)) {
			// TypeScript should know task is Task here
			expect(task.content).toBe("Valid task");
			expect(task.state).toBe("incomplete");
		} else {
			throw new Error("Should be valid");
		}
	});

	it("should return false for invalid task", () => {
		const task = {
			state: "incomplete",
			content: "Invalid task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "invalid",
		};
		expect(isValidTask(task)).toBe(false);
	});

	it("should return false for non-object values", () => {
		expect(isValidTask(null)).toBe(false);
		expect(isValidTask(undefined)).toBe(false);
		expect(isValidTask("string")).toBe(false);
		expect(isValidTask(123)).toBe(false);
		expect(isValidTask([])).toBe(false);
	});
});

describe("validateTaskWithErrors", () => {
	it("should return success result for valid task", () => {
		const task: Task = {
			state: "incomplete",
			content: "Valid task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		const result = validateTaskWithErrors(task);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.content).toBe("Valid task");
		}
	});

	it("should return error result with issues for invalid duration", () => {
		const task = {
			state: "incomplete",
			content: "Invalid task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "invalid",
		};
		const result = validateTaskWithErrors(task);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues.length).toBeGreaterThan(0);
			expect(
				result.error.issues.some((issue) => issue.path.includes("duration")),
			).toBe(true);
		}
	});

	it("should return error result with issues for invalid date", () => {
		const task = {
			state: "incomplete",
			content: "Invalid task",
			type: "quick",
			tags: ["Tasks/Quick"],
			dueAt: "15-01-2025",
		};
		const result = validateTaskWithErrors(task);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues.length).toBeGreaterThan(0);
			expect(
				result.error.issues.some((issue) => issue.path.includes("dueAt")),
			).toBe(true);
		}
	});

	it("should return error result with issues for invalid time", () => {
		const task = {
			state: "incomplete",
			content: "Invalid task",
			type: "quick",
			tags: ["Tasks/Quick"],
			time: { start: "9:00", end: "10:30" },
		};
		const result = validateTaskWithErrors(task);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues.length).toBeGreaterThan(0);
		}
	});

	it("should return error result for empty content", () => {
		const task = {
			state: "incomplete",
			content: "",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		const result = validateTaskWithErrors(task);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(
				result.error.issues.some((issue) => issue.path.includes("content")),
			).toBe(true);
		}
	});

	it("should return error result for missing required fields", () => {
		const task = {
			content: "Task without state",
			type: "quick",
		};
		const result = validateTaskWithErrors(task);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues.length).toBeGreaterThan(0);
		}
	});

	it("should return detailed error information", () => {
		const task = {
			state: "invalid_state",
			content: "",
			type: "invalid_type",
			tags: "not_an_array",
			duration: "invalid",
			priority: "invalid_priority",
		};
		const result = validateTaskWithErrors(task);
		expect(result.success).toBe(false);
		if (!result.success) {
			// Should have multiple issues
			expect(result.error.issues.length).toBeGreaterThan(1);
			// Check that issues have expected properties
			for (const issue of result.error.issues) {
				expect(issue).toHaveProperty("path");
				expect(issue).toHaveProperty("message");
			}
		}
	});
});
