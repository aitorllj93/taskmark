import { describe, expect, it } from "vitest";
import { type ParseConfig, parse } from "./parse";
import { type StringifyConfig, stringify, stringifyArray } from "./stringify";
import type { Task } from "./types";

describe("stringify - Task States", () => {
	it("should stringify incomplete task", () => {
		const task: Task = {
			state: "incomplete",
			content: "Simple task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [ ] Simple task #Tasks/Quick");
	});

	it("should stringify completed task", () => {
		const task: Task = {
			state: "completed",
			content: "Completed task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [x] Completed task #Tasks/Quick");
	});

	it("should stringify in progress task", () => {
		const task: Task = {
			state: "in_progress",
			content: "In progress task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [/] In progress task #Tasks/Quick");
	});

	it("should stringify cancelled task", () => {
		const task: Task = {
			state: "cancelled",
			content: "Cancelled task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [-] Cancelled task #Tasks/Quick");
	});

	it("should stringify forwarded task", () => {
		const task: Task = {
			state: "forwarded",
			content: "Forwarded task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [>] Forwarded task #Tasks/Quick");
	});

	it("should stringify migrated task", () => {
		const task: Task = {
			state: "migrated",
			content: "Migrated task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [<] Migrated task #Tasks/Quick");
	});

	it("should stringify scheduled task", () => {
		const task: Task = {
			state: "scheduled",
			content: "Scheduled task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [@] Scheduled task #Tasks/Quick");
	});

	it("should stringify question task", () => {
		const task: Task = {
			state: "question",
			content: "Question task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [?] Question task #Tasks/Quick");
	});

	it("should stringify important task", () => {
		const task: Task = {
			state: "important",
			content: "Important task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [!] Important task #Tasks/Quick");
	});

	it("should stringify add/create task", () => {
		const task: Task = {
			state: "add",
			content: "Create task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [+] Create task #Tasks/Quick");
	});

	it("should stringify research task", () => {
		const task: Task = {
			state: "research",
			content: "Research task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [R] Research task #Tasks/Quick");
	});

	it("should stringify idea task", () => {
		const task: Task = {
			state: "idea",
			content: "Idea task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [i] Idea task #Tasks/Quick");
	});

	it("should stringify brainstorm task", () => {
		const task: Task = {
			state: "brainstorm",
			content: "Brainstorm task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [B] Brainstorm task #Tasks/Quick");
	});

	it("should stringify location-based task", () => {
		const task: Task = {
			state: "location_based",
			content: "Location task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [L] Location task #Tasks/Quick");
	});

	it("should stringify bookmark task", () => {
		const task: Task = {
			state: "bookmark",
			content: "Bookmark task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [b] Bookmark task #Tasks/Quick");
	});
});

describe("stringify - Task Types", () => {
	it("should stringify Main_Mission type", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Main_Mission");
	});

	it("should stringify Secondary_Mission type", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "secondary_mission",
			tags: ["Tasks/Secondary_Mission"],
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Secondary_Mission");
	});

	it("should stringify Maintenance type", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "maintenance",
			tags: ["Tasks/Maintenance"],
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Maintenance");
	});

	it("should stringify Quick type", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick");
	});

	it("should stringify Admin type", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "admin",
			tags: ["Tasks/Admin"],
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Admin");
	});
});

describe("stringify - Optional Fields", () => {
	it("should stringify task with only content and state", () => {
		const task: Task = {
			state: "incomplete",
			content: "Minimal task",
		};
		expect(stringify(task)).toBe("- [ ] Minimal task");
	});

	it("should stringify completed task with only content and state", () => {
		const task: Task = {
			state: "completed",
			content: "Done task",
		};
		expect(stringify(task)).toBe("- [x] Done task");
	});

	it("should stringify task without type but with tags", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task with custom tags",
			tags: ["custom", "tags"],
		};
		expect(stringify(task)).toBe("- [ ] Task with custom tags #custom #tags");
	});

	it("should stringify task with type but without tags", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task with type only",
			type: "quick",
		};
		expect(stringify(task)).toBe("- [ ] Task with type only #Tasks/Quick");
	});

	it("should stringify task without priority", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task without priority",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [ ] Task without priority #Tasks/Quick");
	});

	it("should stringify task with only content, state and other metadata", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task with metadata",
			id: "task123",
			duration: "30m",
			energy: "high",
		};
		expect(stringify(task)).toBe(
			"- [ ] Task with metadata 🌡️ high ⏱️ 30m 🆔 task123",
		);
	});

	it("should stringify task with focuses but no type", () => {
		const task: Task = {
			state: "incomplete",
			content: "Focused task",
			focuses: ["critical", "hyper_focus"],
		};
		expect(stringify(task)).toBe("- [ ] 🎯🔥 Focused task");
	});

	it("should stringify task with scenarios but no type", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task with scenario",
			scenarios: ["Work"],
			tags: ["Scenarios/Work"],
		};
		expect(stringify(task)).toBe("- [ ] Task with scenario #Scenarios/Work");
	});
});

describe("stringify - Tags", () => {
	it("should stringify task with multiple tags", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "urgent", "backend"],
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick #urgent #backend");
	});

	it("should stringify task with scenario tags", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Work/Programming"],
		};
		expect(stringify(task)).toBe(
			"- [ ] Task #Tasks/Quick #Scenarios/Work/Programming",
		);
	});

	it("should stringify task with custom tags", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "bug", "priority", "frontend"],
		};
		expect(stringify(task)).toBe(
			"- [ ] Task #Tasks/Quick #bug #priority #frontend",
		);
	});

	it("should preserve tag order", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "first", "second", "third"],
		};
		expect(stringify(task)).toBe(
			"- [ ] Task #Tasks/Quick #first #second #third",
		);
	});
});

describe("stringify - Focuses", () => {
	it("should stringify critical task focus", () => {
		const task: Task = {
			state: "incomplete",
			content: "Critical task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["critical"],
		};
		expect(stringify(task)).toBe("- [ ] 🎯 Critical task #Tasks/Quick");
	});

	it("should stringify mechanical task focus", () => {
		const task: Task = {
			state: "incomplete",
			content: "Mechanical task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["mechanical"],
		};
		expect(stringify(task)).toBe("- [ ] 🔧 Mechanical task #Tasks/Quick");
	});

	it("should stringify maintenance focus", () => {
		const task: Task = {
			state: "incomplete",
			content: "Maintenance task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["maintenance"],
		};
		expect(stringify(task)).toBe("- [ ] 🧹 Maintenance task #Tasks/Quick");
	});

	it("should stringify hyper-focus ideal", () => {
		const task: Task = {
			state: "incomplete",
			content: "Intense task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["hyper_focus"],
		};
		expect(stringify(task)).toBe("- [ ] 🔥 Intense task #Tasks/Quick");
	});

	it("should stringify low energy focus", () => {
		const task: Task = {
			state: "incomplete",
			content: "Low energy task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["low_energy"],
		};
		expect(stringify(task)).toBe("- [ ] 🐢 Low energy task #Tasks/Quick");
	});

	it("should stringify high energy focus", () => {
		const task: Task = {
			state: "incomplete",
			content: "High energy task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["high_energy"],
		};
		expect(stringify(task)).toBe("- [ ] ⚡ High energy task #Tasks/Quick");
	});

	it("should stringify chunking focus", () => {
		const task: Task = {
			state: "incomplete",
			content: "Chunking task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["chunking"],
		};
		expect(stringify(task)).toBe("- [ ] 🪓 Chunking task #Tasks/Quick");
	});

	it("should stringify errands focus", () => {
		const task: Task = {
			state: "incomplete",
			content: "Errands task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["errands"],
		};
		expect(stringify(task)).toBe("- [ ] 📦 Errands task #Tasks/Quick");
	});

	it("should stringify hard cognitive focus", () => {
		const task: Task = {
			state: "incomplete",
			content: "Hard cognitive task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["hard_cognitive"],
		};
		expect(stringify(task)).toBe("- [ ] 🧠 Hard cognitive task #Tasks/Quick");
	});

	it("should stringify multiple focuses", () => {
		const task: Task = {
			state: "incomplete",
			content: "Complex task",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
			focuses: ["critical", "hyper_focus", "hard_cognitive"],
		};
		expect(stringify(task)).toBe(
			"- [ ] 🎯🔥🧠 Complex task #Tasks/Main_Mission",
		);
	});

	it("should work without focuses", () => {
		const task: Task = {
			state: "incomplete",
			content: "Simple task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [ ] Simple task #Tasks/Quick");
	});
});

describe("stringify - Scenarios", () => {
	it("should stringify single scenario", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Work"],
			scenarios: ["Work"],
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick #Scenarios/Work");
	});

	it("should stringify nested scenarios", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Work/Intense/Programming"],
			scenarios: ["Work/Intense/Programming"],
		};
		expect(stringify(task)).toBe(
			"- [ ] Task #Tasks/Quick #Scenarios/Work/Intense/Programming",
		);
	});

	it("should stringify multiple scenarios", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Work", "Scenarios/Home"],
			scenarios: ["Work", "Home"],
		};
		expect(stringify(task)).toBe(
			"- [ ] Task #Tasks/Quick #Scenarios/Work #Scenarios/Home",
		);
	});
});

describe("stringify - Energy", () => {
	it("should stringify high energy", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			energy: "high",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 🌡️ high");
	});

	it("should stringify medium energy", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			energy: "medium",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 🌡️ medium");
	});

	it("should stringify low energy", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			energy: "low",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 🌡️ low");
	});

	it("should work without energy", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).not.toContain("🌡️");
	});
});

describe("stringify - Duration", () => {
	it("should stringify 15m duration", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "15m",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⏱️ 15m");
	});

	it("should stringify 30m duration", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "30m",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⏱️ 30m");
	});

	it("should stringify 90m duration", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "90m",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⏱️ 90m");
	});

	it("should stringify 2h duration", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "2h",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⏱️ 2h");
	});

	it("should work without duration", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).not.toContain("⏱️");
	});
});

describe("stringify - Blocking", () => {
	it("should stringify blocking indicator", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			blocking: true,
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 🔒");
	});

	it("should work without blocking", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).not.toContain("🔒");
	});
});

describe("stringify - Dates", () => {
	it("should stringify created date", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			createdAt: "2025-01-12",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ➕ 2025-01-12");
	});

	it("should stringify scheduled date", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			scheduledAt: "2025-01-12",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⏳ 2025-01-12");
	});

	it("should stringify start date", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			startedAt: "2025-01-12",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 🛫 2025-01-12");
	});

	it("should stringify due date", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			dueAt: "2025-01-12",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 📅 2025-01-12");
	});

	it("should stringify completion date", () => {
		const task: Task = {
			state: "completed",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			completedAt: "2025-01-12",
		};
		expect(stringify(task)).toBe("- [x] Task #Tasks/Quick ✅ 2025-01-12");
	});

	it("should stringify cancellation date", () => {
		const task: Task = {
			state: "cancelled",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			cancelledAt: "2025-01-12",
		};
		expect(stringify(task)).toBe("- [-] Task #Tasks/Quick ❌ 2025-01-12");
	});

	it("should stringify multiple dates", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			createdAt: "2025-01-10",
			scheduledAt: "2025-01-11",
			dueAt: "2025-01-12",
		};
		expect(stringify(task)).toBe(
			"- [ ] Task #Tasks/Quick ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-12",
		);
	});
});

describe("stringify - Times", () => {
	it("should stringify time range", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			time: { start: "09:00", end: "10:30" },
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⏰ [09:00 - 10:30]");
	});

	it("should stringify time range with different formats", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			time: { start: "14:00", end: "15:45" },
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⏰ [14:00 - 15:45]");
	});

	it("should work without time", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).not.toContain("⏰");
	});
});

describe("stringify - Priority", () => {
	it("should stringify maximum priority", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			priority: "maximum",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 🔺");
	});

	it("should stringify high priority", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			priority: "high",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⏫");
	});

	it("should stringify medium priority", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			priority: "medium",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 🔼");
	});

	it("should not include priority emoji for normal priority", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).not.toContain("🔺");
		expect(stringify(task)).not.toContain("⏫");
		expect(stringify(task)).not.toContain("🔼");
		expect(stringify(task)).not.toContain("🔽");
		expect(stringify(task)).not.toContain("⏬");
	});

	it("should stringify low priority", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			priority: "low",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 🔽");
	});

	it("should stringify minimum priority", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			priority: "minimum",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⏬");
	});
});

describe("stringify - Recurrence", () => {
	it("should stringify recurrence rule", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			recurrence: "every week on Monday",
		};
		expect(stringify(task)).toBe(
			"- [ ] Task #Tasks/Quick 🔁 every week on Monday",
		);
	});

	it("should stringify complex recurrence rule", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			recurrence: "every 2 weeks on Tuesday",
		};
		expect(stringify(task)).toBe(
			"- [ ] Task #Tasks/Quick 🔁 every 2 weeks on Tuesday",
		);
	});

	it("should work without recurrence", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).not.toContain("🔁");
	});
});

describe("stringify - Dependencies", () => {
	it("should stringify task ID", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			id: "abc123",
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 🆔 abc123");
	});

	it("should stringify blocked by dependency", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			dependencies: ["def999"],
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⛔ def999");
	});

	it("should stringify multiple blocked by dependencies", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			dependencies: ["def999", "xyz111"],
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick ⛔ def999 ⛔ xyz111");
	});

	it("should stringify on completion dependency", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			hooks: { onCompletion: ["start:abc123"] },
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick 🏁 start:abc123");
	});

	it("should stringify multiple on completion dependencies", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			hooks: { onCompletion: ["start:abc123", "notify:def456"] },
		};
		expect(stringify(task)).toBe(
			"- [ ] Task #Tasks/Quick 🏁 start:abc123 🏁 notify:def456",
		);
	});

	it("should stringify all dependency types together", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			id: "task001",
			dependencies: ["task002"],
			hooks: { onCompletion: ["start:task003"] },
		};
		expect(stringify(task)).toBe(
			"- [ ] Task #Tasks/Quick 🆔 task001 ⛔ task002 🏁 start:task003",
		);
	});
});

describe("stringify - Complex Examples from SPEC", () => {
	it("should stringify Example 1 - Simple task with focus and scenario", () => {
		const task: Task = {
			state: "incomplete",
			content: "Clean the downloads folder",
			type: "maintenance",
			tags: ["Tasks/Maintenance", "Scenarios/Home/Organization"],
			focuses: ["mechanical"],
			scenarios: ["Home/Organization"],
			energy: "low",
			duration: "15m",
		};
		expect(stringify(task)).toBe(
			"- [ ] 🔧 Clean the downloads folder #Tasks/Maintenance #Scenarios/Home/Organization 🌡️ low ⏱️ 15m",
		);
	});

	it("should stringify Example 2 - Complex main mission", () => {
		const task: Task = {
			state: "incomplete",
			content: "Implement authentication module",
			type: "main_mission",
			tags: ["Tasks/Main_Mission", "Scenarios/Work/Intense/Programming"],
			focuses: ["critical", "hyper_focus", "hard_cognitive"],
			scenarios: ["Work/Intense/Programming"],
			energy: "high",
			duration: "90m",
			priority: "maximum",
			createdAt: "2025-01-10",
			scheduledAt: "2025-01-11",
			dueAt: "2025-01-11",
			id: "auth01",
		};
		expect(stringify(task)).toBe(
			"- [ ] 🎯🔥🧠 Implement authentication module #Tasks/Main_Mission #Scenarios/Work/Intense/Programming 🌡️ high ⏱️ 90m 🔺 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-11 🆔 auth01",
		);
	});

	it("should stringify Example 3 - Dependent errand", () => {
		const task: Task = {
			state: "incomplete",
			content: "Buy fruit at the supermarket",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Shopping/SuperMarket/Fruit"],
			focuses: ["errands", "high_energy"],
			scenarios: ["Shopping/SuperMarket/Fruit"],
			duration: "15m",
			energy: "medium",
			dependencies: ["planRuta01"],
		};
		expect(stringify(task)).toBe(
			"- [ ] 📦⚡ Buy fruit at the supermarket #Tasks/Quick #Scenarios/Shopping/SuperMarket/Fruit 🌡️ medium ⏱️ 15m ⛔ planRuta01",
		);
	});
});

describe("stringify - Round-trip (parse ↔ stringify)", () => {
	it("should round-trip simple task", () => {
		const original = "- [ ] Simple task #Tasks/Quick";
		const parsed = parse(original);
		const stringified = stringify(parsed);
		// Note: exact match might differ due to ordering, but should parse back correctly
		const reparsed = parse(stringified);
		expect(reparsed.state).toBe(parsed.state);
		expect(reparsed.content).toBe(parsed.content);
		expect(reparsed.type).toBe(parsed.type);
	});

	it("should round-trip task with all metadata", () => {
		const original =
			"- [ ] 🎯 Complete project #Tasks/Main_Mission #Scenarios/Work 🌡️ high ⏱️ 90m 🔒 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-12 ⏰ [09:00 - 10:30] 🔺 🔁 every week 🆔 proj01 ⛔ task02 🏁 start:task03";
		const parsed = parse(original);
		const stringified = stringify(parsed);
		const reparsed = parse(stringified);

		expect(reparsed.state).toBe(parsed.state);
		expect(reparsed.content).toBe(parsed.content);
		expect(reparsed.type).toBe(parsed.type);
		expect(reparsed.focuses).toEqual(parsed.focuses);
		expect(reparsed.scenarios).toEqual(parsed.scenarios);
		expect(reparsed.energy).toBe(parsed.energy);
		expect(reparsed.duration).toBe(parsed.duration);
		expect(reparsed.blocking).toBe(parsed.blocking);
		expect(reparsed.createdAt).toBe(parsed.createdAt);
		expect(reparsed.scheduledAt).toBe(parsed.scheduledAt);
		expect(reparsed.dueAt).toBe(parsed.dueAt);
		expect(reparsed.time).toEqual(parsed.time);
		expect(reparsed.priority).toBe(parsed.priority);
		expect(reparsed.recurrence).toBe(parsed.recurrence);
		expect(reparsed.id).toBe(parsed.id);
		expect(reparsed.dependencies).toEqual(parsed.dependencies);
		expect(reparsed.hooks).toEqual(parsed.hooks);
	});

	it("should round-trip task with multiple focuses", () => {
		const original = "- [ ] 🎯🔥🧠 Complex task #Tasks/Main_Mission";
		const parsed = parse(original);
		const stringified = stringify(parsed);
		const reparsed = parse(stringified);
		expect(reparsed.focuses).toEqual(parsed.focuses);
	});

	it("should round-trip task with multiple scenarios", () => {
		const original = "- [ ] Task #Tasks/Quick #Scenarios/Work #Scenarios/Home";
		const parsed = parse(original);
		const stringified = stringify(parsed);
		const reparsed = parse(stringified);
		expect(reparsed.scenarios).toEqual(parsed.scenarios);
	});

	it("should round-trip task with custom tags", () => {
		const original = "- [ ] Fix bug #Tasks/Quick #bug #urgent #backend";
		const parsed = parse(original);
		const stringified = stringify(parsed);
		const reparsed = parse(stringified);
		expect(reparsed.tags?.sort()).toEqual(parsed.tags?.sort());
	});
});

describe("stringify - Edge Cases", () => {
	it("should handle task with all metadata types", () => {
		const task: Task = {
			state: "incomplete",
			content: "Complete project",
			type: "main_mission",
			tags: ["Tasks/Main_Mission", "Scenarios/Work"],
			focuses: ["critical"],
			scenarios: ["Work"],
			energy: "high",
			duration: "90m",
			blocking: true,
			createdAt: "2025-01-10",
			scheduledAt: "2025-01-11",
			dueAt: "2025-01-12",
			time: { start: "09:00", end: "10:30" },
			priority: "maximum",
			recurrence: "every week",
			id: "proj01",
			dependencies: ["task02"],
			hooks: { onCompletion: ["start:task03"] },
		};
		expect(stringify(task)).toBe(
			"- [ ] 🎯 Complete project #Tasks/Main_Mission #Scenarios/Work 🌡️ high ⏱️ 90m 🔒 🔺 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-12 ⏰ [09:00 - 10:30] 🔁 every week 🆔 proj01 ⛔ task02 🏁 start:task03",
		);
	});

	it("should handle content with special characters", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task with @mentions and #hashtags but valid",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe(
			"- [ ] Task with @mentions and #hashtags but valid #Tasks/Quick",
		);
	});

	it("should handle minimal task", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(stringify(task)).toBe("- [ ] Task #Tasks/Quick");
	});
});

describe("stringify - StringifyConfig", () => {
	it("should support custom typeTagMapping", () => {
		const task: Task = {
			state: "incomplete",
			content: "Tarea",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
		};
		const config: StringifyConfig = {
			typeTagMapping: {
				main_mission: "Tareas/Mision_Principal",
				secondary_mission: "Tareas/Mision_Secundaria",
				maintenance: "Tareas/Mantenimiento",
				quick: "Tareas/Rapida",
				admin: "Tareas/Admin",
			},
		};
		expect(stringify(task, config)).toBe(
			"- [ ] Tarea #Tareas/Mision_Principal",
		);
	});

	it("should support custom scenarioPrefix", () => {
		const task: Task = {
			state: "incomplete",
			content: "Tarea",
			type: "quick",
			tags: ["Tasks/Quick"],
			scenarios: ["Trabajo"],
		};
		const config: StringifyConfig = {
			scenarioPrefix: "Escenarios/",
		};
		expect(stringify(task, config)).toBe(
			"- [ ] Tarea #Tasks/Quick #Escenarios/Trabajo",
		);
	});

	it("should support custom scenarioMapping", () => {
		const task: Task = {
			state: "incomplete",
			content: "Tarea",
			type: "quick",
			tags: ["Tasks/Quick"],
			scenarios: ["work", "home"],
		};
		const config: StringifyConfig = {
			scenarioMapping: {
				work: "Escenarios/Trabajo",
				home: "Escenarios/Casa",
			},
		};
		expect(stringify(task, config)).toBe(
			"- [ ] Tarea #Tasks/Quick #Escenarios/Trabajo #Escenarios/Casa",
		);
	});

	it("should support full internationalization example (Spanish)", () => {
		const task: Task = {
			state: "incomplete",
			content: "Implementar autenticación",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
			focuses: ["critical"],
		};
		const config: StringifyConfig = {
			typeTagMapping: {
				main_mission: "Tareas/Mision_Principal",
				secondary_mission: "Tareas/Mision_Secundaria",
				maintenance: "Tareas/Mantenimiento",
				quick: "Tareas/Rapida",
				admin: "Tareas/Admin",
			},
		};
		expect(stringify(task, config)).toBe(
			"- [ ] 🎯 Implementar autenticación #Tareas/Mision_Principal",
		);
	});

	it("should support full internationalization with types and scenarios (Spanish)", () => {
		const task: Task = {
			state: "incomplete",
			content: "Implementar login",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
			scenarios: ["work/programming"],
		};
		const config: StringifyConfig = {
			typeTagMapping: {
				main_mission: "Tareas/Mision_Principal",
				secondary_mission: "Tareas/Mision_Secundaria",
				maintenance: "Tareas/Mantenimiento",
				quick: "Tareas/Rapida",
				admin: "Tareas/Admin",
			},
			scenarioPrefix: "Escenarios/",
			scenarioMapping: {
				"work/programming": "Escenarios/Trabajo/Programacion",
			},
		};
		expect(stringify(task, config)).toBe(
			"- [ ] Implementar login #Tareas/Mision_Principal #Escenarios/Trabajo/Programacion",
		);
	});

	it("should round-trip with custom config (Spanish)", () => {
		const original =
			"- [ ] 🎯 Implementar autenticación #Tareas/Mision_Principal";
		const parseConfig: ParseConfig = {
			typeTagMapping: {
				"Tareas/Mision_Principal": "main_mission",
				"Tareas/Mision_Secundaria": "secondary_mission",
				"Tareas/Mantenimiento": "maintenance",
				"Tareas/Rapida": "quick",
				"Tareas/Admin": "admin",
			},
		};
		const stringifyConfig: StringifyConfig = {
			typeTagMapping: {
				main_mission: "Tareas/Mision_Principal",
				secondary_mission: "Tareas/Mision_Secundaria",
				maintenance: "Tareas/Mantenimiento",
				quick: "Tareas/Rapida",
				admin: "Tareas/Admin",
			},
		};
		const parsed = parse(original, parseConfig);
		const stringified = stringify(parsed, stringifyConfig);
		const reparsed = parse(stringified, parseConfig);

		expect(reparsed.state).toBe(parsed.state);
		expect(reparsed.content).toBe(parsed.content);
		expect(reparsed.type).toBe(parsed.type);
		expect(stringified).toBe(
			"- [ ] 🎯 Implementar autenticación #Tareas/Mision_Principal",
		);
	});

	it("should round-trip with custom scenarios config", () => {
		const original =
			"- [ ] Task #Tasks/Quick #Escenarios/Trabajo #Escenarios/Casa";
		const parseConfig: ParseConfig = {
			scenarioPrefix: "Escenarios/",
			scenarioMapping: {
				"Escenarios/Trabajo": "work",
				"Escenarios/Casa": "home",
			},
		};
		const stringifyConfig: StringifyConfig = {
			scenarioPrefix: "Escenarios/",
			scenarioMapping: {
				work: "Escenarios/Trabajo",
				home: "Escenarios/Casa",
			},
		};
		const parsed = parse(original, parseConfig);
		const stringified = stringify(parsed, stringifyConfig);
		const reparsed = parse(stringified, parseConfig);

		expect(reparsed.scenarios).toEqual(parsed.scenarios);
		expect(stringified).toBe(
			"- [ ] Task #Tasks/Quick #Escenarios/Trabajo #Escenarios/Casa",
		);
	});

	it("should handle scenarios without mapping but with custom prefix", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			scenarios: ["Trabajo", "Casa"],
		};
		const config: StringifyConfig = {
			scenarioPrefix: "Escenarios/",
		};
		expect(stringify(task, config)).toBe(
			"- [ ] Task #Tasks/Quick #Escenarios/Trabajo #Escenarios/Casa",
		);
	});

	it("should preserve custom tags when using config", () => {
		const task: Task = {
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "urgent", "backend"],
		};
		const config: StringifyConfig = {
			typeTagMapping: {
				main_mission: "Tareas/Mision_Principal",
				secondary_mission: "Tareas/Mision_Secundaria",
				maintenance: "Tareas/Mantenimiento",
				quick: "Tareas/Rapida",
				admin: "Tareas/Admin",
			},
		};
		expect(stringify(task, config)).toBe(
			"- [ ] Task #Tareas/Rapida #urgent #backend",
		);
	});
});

describe("stringifyArray", () => {
	it("should stringify array of tasks with newlines", () => {
		const tasks: Task[] = [
			{
				state: "incomplete",
				content: "First task",
				type: "quick",
				tags: ["Tasks/Quick"],
			},
			{
				state: "completed",
				content: "Second task",
				type: "quick",
				tags: ["Tasks/Quick"],
			},
			{
				state: "incomplete",
				content: "Third task",
				type: "main_mission",
				tags: ["Tasks/Main_Mission"],
			},
		];
		const result = stringifyArray(tasks);
		expect(result).toBe(
			"- [ ] First task #Tasks/Quick\n- [x] Second task #Tasks/Quick\n- [ ] Third task #Tasks/Main_Mission",
		);
	});

	it("should handle empty array", () => {
		const tasks: Task[] = [];
		const result = stringifyArray(tasks);
		expect(result).toBe("");
	});

	it("should handle single task", () => {
		const tasks: Task[] = [
			{
				state: "incomplete",
				content: "Single task",
				type: "quick",
				tags: ["Tasks/Quick"],
			},
		];
		const result = stringifyArray(tasks);
		expect(result).toBe("- [ ] Single task #Tasks/Quick");
	});

	it("should support config for all tasks", () => {
		const tasks: Task[] = [
			{
				state: "incomplete",
				content: "Tarea 1",
				type: "main_mission",
				tags: ["Tasks/Main_Mission"],
			},
			{
				state: "incomplete",
				content: "Tarea 2",
				type: "quick",
				tags: ["Tasks/Quick"],
			},
		];
		const config: StringifyConfig = {
			typeTagMapping: {
				main_mission: "Tareas/Mision_Principal",
				secondary_mission: "Tareas/Mision_Secundaria",
				maintenance: "Tareas/Mantenimiento",
				quick: "Tareas/Rapida",
				admin: "Tareas/Admin",
			},
		};
		const result = stringifyArray(tasks, config);
		expect(result).toBe(
			"- [ ] Tarea 1 #Tareas/Mision_Principal\n- [ ] Tarea 2 #Tareas/Rapida",
		);
	});

	it("should handle tasks with complex metadata", () => {
		const tasks: Task[] = [
			{
				state: "incomplete",
				content: "Task with focus",
				type: "quick",
				tags: ["Tasks/Quick"],
				focuses: ["critical"],
			},
			{
				state: "completed",
				content: "Task with dates",
				type: "quick",
				tags: ["Tasks/Quick"],
				createdAt: "2025-01-10",
				completedAt: "2025-01-12",
			},
		];
		const result = stringifyArray(tasks);
		expect(result).toBe(
			"- [ ] 🎯 Task with focus #Tasks/Quick\n- [x] Task with dates #Tasks/Quick ➕ 2025-01-10 ✅ 2025-01-12",
		);
	});
});

describe("stringify - Validation Options", () => {
	it("should validate by default", () => {
		// Valid task should stringify without error
		const validTask: Task = {
			state: "incomplete",
			content: "Valid task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(() => stringify(validTask)).not.toThrow();

		// Invalid task should throw error
		const invalidTask = {
			state: "incomplete",
			content: "Invalid task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "invalid", // Invalid duration format
		} as Task;
		expect(() => stringify(invalidTask)).toThrow();
	});

	it("should validate when explicitly enabled", () => {
		// Valid task should stringify without error
		const validTask: Task = {
			state: "incomplete",
			content: "Valid task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		expect(() => stringify(validTask, { validate: true })).not.toThrow();

		// Invalid task should throw error
		const invalidTask = {
			state: "incomplete",
			content: "Invalid task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "invalid",
		} as Task;
		expect(() => stringify(invalidTask, { validate: true })).toThrow();
	});

	it("should skip validation when disabled", () => {
		// Valid task should stringify without error
		const validTask: Task = {
			state: "incomplete",
			content: "Valid task",
			type: "quick",
			tags: ["Tasks/Quick"],
		};
		const result1 = stringify(validTask, { validate: false });
		expect(result1).toBe("- [ ] Valid task #Tasks/Quick");

		// Invalid task should still stringify (no validation)
		const invalidTask = {
			state: "incomplete",
			content: "Invalid task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "invalid",
		} as Task;
		const result2 = stringify(invalidTask, { validate: false });
		expect(result2).toBe("- [ ] Invalid task #Tasks/Quick ⏱️ invalid");
	});

	it("should validate dates correctly", () => {
		// Valid date
		const validTask: Task = {
			state: "incomplete",
			content: "Task with valid date",
			type: "quick",
			tags: ["Tasks/Quick"],
			dueAt: "2025-01-15",
		};
		expect(() => stringify(validTask)).not.toThrow();

		// Invalid date format
		const invalidTask = {
			state: "incomplete",
			content: "Task with invalid date",
			type: "quick",
			tags: ["Tasks/Quick"],
			dueAt: "15-01-2025",
		} as Task;
		expect(() => stringify(invalidTask)).toThrow();
	});

	it("should validate time ranges correctly", () => {
		// Valid time range
		const validTask: Task = {
			state: "incomplete",
			content: "Task with valid time",
			type: "quick",
			tags: ["Tasks/Quick"],
			time: { start: "09:00", end: "10:30" },
		};
		expect(() => stringify(validTask)).not.toThrow();

		// Invalid time format
		const invalidTask = {
			state: "incomplete",
			content: "Task with invalid time",
			type: "quick",
			tags: ["Tasks/Quick"],
			time: { start: "9:00", end: "10:30" },
		} as Task;
		expect(() => stringify(invalidTask)).toThrow();
	});
});
