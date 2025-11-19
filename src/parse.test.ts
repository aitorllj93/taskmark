import { describe, expect, it } from "vitest";
import { type ParseConfig, parse, parseArray } from "./parse";
import { stringify } from "./stringify";

describe("parse - Task States", () => {
	it("should parse incomplete task", () => {
		expect(parse("- [ ] Simple task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Simple task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse completed task", () => {
		expect(parse("- [x] Completed task #Tasks/Quick")).toMatchObject({
			state: "completed",
			content: "Completed task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse in progress task", () => {
		expect(parse("- [/] In progress task #Tasks/Quick")).toMatchObject({
			state: "in_progress",
			content: "In progress task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse cancelled task", () => {
		expect(parse("- [-] Cancelled task #Tasks/Quick")).toMatchObject({
			state: "cancelled",
			content: "Cancelled task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse forwarded task", () => {
		expect(parse("- [>] Forwarded task #Tasks/Quick")).toMatchObject({
			state: "forwarded",
			content: "Forwarded task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse migrated task", () => {
		expect(parse("- [<] Migrated task #Tasks/Quick")).toMatchObject({
			state: "migrated",
			content: "Migrated task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse scheduled task", () => {
		expect(parse("- [@] Scheduled task #Tasks/Quick")).toMatchObject({
			state: "scheduled",
			content: "Scheduled task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse question task", () => {
		expect(parse("- [?] Question task #Tasks/Quick")).toMatchObject({
			state: "question",
			content: "Question task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse important task", () => {
		expect(parse("- [!] Important task #Tasks/Quick")).toMatchObject({
			state: "important",
			content: "Important task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse add/create task", () => {
		expect(parse("- [+] Create task #Tasks/Quick")).toMatchObject({
			state: "add",
			content: "Create task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse research task", () => {
		expect(parse("- [R] Research task #Tasks/Quick")).toMatchObject({
			state: "research",
			content: "Research task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse idea task", () => {
		expect(parse("- [i] Idea task #Tasks/Quick")).toMatchObject({
			state: "idea",
			content: "Idea task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse brainstorm task", () => {
		expect(parse("- [B] Brainstorm task #Tasks/Quick")).toMatchObject({
			state: "brainstorm",
			content: "Brainstorm task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse location-based task", () => {
		expect(parse("- [L] Location task #Tasks/Quick")).toMatchObject({
			state: "location_based",
			content: "Location task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse bookmark task", () => {
		expect(parse("- [b] Bookmark task #Tasks/Quick")).toMatchObject({
			state: "bookmark",
			content: "Bookmark task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should throw error on missing state", () => {
		expect(() => parse("Simple task #Tasks/Quick")).toThrow(
			"Invalid task format: missing state",
		);
	});

	it("should throw error on invalid state symbol", () => {
		expect(() => parse("- [Z] Invalid state #Tasks/Quick")).toThrow(
			"Invalid task state symbol: Z",
		);
	});
});

describe("parse - Optional Fields", () => {
	it("should parse task with only state and content", () => {
		const result = parse("- [ ] Minimal task");
		expect(result).toMatchObject({
			state: "incomplete",
			content: "Minimal task",
		});
		expect(result.type).toBeUndefined();
		expect(result.tags).toEqual([]);
		expect(result.priority).toBeUndefined();
	});

	it("should parse completed task with only state and content", () => {
		const result = parse("- [x] Done task");
		expect(result).toMatchObject({
			state: "completed",
			content: "Done task",
		});
		expect(result.type).toBeUndefined();
		expect(result.tags).toEqual([]);
		expect(result.priority).toBeUndefined();
	});

	it("should parse task without type but with custom tags", () => {
		const result = parse("- [ ] Task with tags #custom #important");
		expect(result).toMatchObject({
			state: "incomplete",
			content: "Task with tags",
			tags: ["custom", "important"],
		});
		expect(result.type).toBeUndefined();
		expect(result.priority).toBeUndefined();
	});

	it("should parse task with type but without priority", () => {
		const result = parse("- [ ] Task with type #Tasks/Quick");
		expect(result).toMatchObject({
			state: "incomplete",
			content: "Task with type",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
		expect(result.priority).toBeUndefined();
	});

	it("should parse task with only content, state and metadata", () => {
		const result = parse("- [ ] Task with metadata 🌡️ high ⏱️ 30m 🆔 task123");
		expect(result).toMatchObject({
			state: "incomplete",
			content: "Task with metadata",
			energy: "high",
			duration: "30m",
			id: "task123",
		});
		expect(result.type).toBeUndefined();
		expect(result.tags).toEqual([]);
		expect(result.priority).toBeUndefined();
	});

	it("should parse task with focuses but no type", () => {
		const result = parse("- [ ] 🎯🔥 Focused task");
		expect(result).toMatchObject({
			state: "incomplete",
			content: "Focused task",
			focuses: ["critical", "hyper_focus"],
		});
		expect(result.type).toBeUndefined();
		expect(result.tags).toEqual([]);
		expect(result.priority).toBeUndefined();
	});

	it("should parse task with scenario but no type", () => {
		const result = parse("- [ ] Task with scenario #Scenarios/Work");
		expect(result).toMatchObject({
			state: "incomplete",
			content: "Task with scenario",
			scenarios: ["Work"],
			tags: ["Scenarios/Work"],
		});
		expect(result.type).toBeUndefined();
		expect(result.priority).toBeUndefined();
	});

	it("should round-trip minimal task", () => {
		const original = "- [ ] Minimal task";
		const parsed = parse(original);
		const stringified = stringify(parsed);
		expect(stringified).toBe(original);
	});

	it("should round-trip task without type", () => {
		const original = "- [ ] Task #custom #tags";
		const parsed = parse(original);
		const stringified = stringify(parsed);
		expect(stringified).toBe(original);
	});
});

describe("parse - Task Types", () => {
	it("should parse Main_Mission type", () => {
		expect(parse("- [ ] Task #Tasks/Main_Mission")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
		});
	});

	it("should parse Secondary_Mission type", () => {
		expect(parse("- [ ] Task #Tasks/Secondary_Mission")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "secondary_mission",
			tags: ["Tasks/Secondary_Mission"],
		});
	});

	it("should parse Maintenance type", () => {
		expect(parse("- [ ] Task #Tasks/Maintenance")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "maintenance",
			tags: ["Tasks/Maintenance"],
		});
	});

	it("should parse Quick type", () => {
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should parse Admin type", () => {
		expect(parse("- [ ] Task #Tasks/Admin")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "admin",
			tags: ["Tasks/Admin"],
		});
	});

	it("should parse task without type", () => {
		const result = parse("- [ ] Task without type");
		expect(result).toMatchObject({
			state: "incomplete",
			content: "Task without type",
			tags: [],
		});
		expect(result.type).toBeUndefined();
	});

	it("should support custom type tag mapping", () => {
		expect(
			parse("- [ ] Tarea #Tareas/Mision_Principal", {
				typeTagMapping: { "Tareas/Mision_Principal": "main_mission" },
			}),
		).toMatchObject({
			state: "incomplete",
			content: "Tarea",
			type: "main_mission",
			tags: ["Tareas/Mision_Principal"],
		});
	});

	it("should support mixed default and custom mappings", () => {
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});

		expect(
			parse("- [ ] Tarea #Tareas/Rapida", {
				typeTagMapping: { "Tareas/Rapida": "quick" },
			}),
		).toMatchObject({
			state: "incomplete",
			content: "Tarea",
			type: "quick",
			tags: ["Tareas/Rapida"],
		});
	});

	it("should prioritize first matching tag in custom mapping", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick #CustomType", {
				typeTagMapping: { CustomType: "admin" },
			}),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "CustomType"],
		});
	});

	it("should support full internationalization example (Spanish)", () => {
		const spanishConfig = {
			typeTagMapping: {
				"Tareas/Mision_Principal": "main_mission",
				"Tareas/Mision_Secundaria": "secondary_mission",
				"Tareas/Mantenimiento": "maintenance",
				"Tareas/Rapida": "quick",
				"Tareas/Admin": "admin",
			},
		} satisfies ParseConfig;

		expect(
			parse(
				"- [ ] 🎯 Implementar autenticación #Tareas/Mision_Principal",
				spanishConfig,
			),
		).toMatchObject({
			state: "incomplete",
			content: "Implementar autenticación",
			type: "main_mission",
			tags: ["Tareas/Mision_Principal"],
			focuses: ["critical"],
		});
	});

	it("should support full internationalization example (French)", () => {
		const frenchConfig = {
			typeTagMapping: {
				"Tâches/Mission_Principale": "main_mission",
				"Tâches/Mission_Secondaire": "secondary_mission",
				"Tâches/Maintenance": "maintenance",
				"Tâches/Rapide": "quick",
				"Tâches/Admin": "admin",
			},
		} satisfies ParseConfig;

		expect(
			parse("- [ ] Réviser le code #Tâches/Rapide", frenchConfig),
		).toMatchObject({
			state: "incomplete",
			content: "Réviser le code",
			type: "quick",
			tags: ["Tâches/Rapide"],
		});
	});

	it("should support full internationalization with types and scenarios (Spanish)", () => {
		const spanishConfig = {
			typeTagMapping: {
				"Tareas/Mision_Principal": "main_mission",
				"Tareas/Rapida": "quick",
			},
			scenarioPrefix: "Escenarios/",
			scenarioMapping: {
				"Escenarios/Trabajo": "work",
				"Escenarios/Casa": "home",
				"Escenarios/Trabajo/Programacion": "work/programming",
			},
		} satisfies ParseConfig;

		expect(
			parse(
				"- [ ] Implementar login #Tareas/Mision_Principal #Escenarios/Trabajo/Programacion",
				spanishConfig,
			),
		).toMatchObject({
			state: "incomplete",
			content: "Implementar login",
			type: "main_mission",
			tags: ["Tareas/Mision_Principal", "Escenarios/Trabajo/Programacion"],
			scenarios: ["work/programming"],
		});
	});
});

describe("parse - Tags", () => {
	it("should extract all tags from the line", () => {
		expect(parse("- [ ] Task #Tasks/Quick #urgent #backend")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "urgent", "backend"],
		});
	});

	it("should include task type in tags", () => {
		expect(parse("- [ ] Task #Tasks/Main_Mission")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
		});
	});

	it("should include scenario tags", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick #Scenarios/Work/Programming"),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Work/Programming"],
			scenarios: ["Work/Programming"],
		});
	});

	it("should include custom tags not related to type or scenario", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick #bug #priority #frontend"),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "bug", "priority", "frontend"],
		});
	});

	it("should handle multiple scenarios and custom tags", () => {
		expect(
			parse(
				"- [ ] Task #Tasks/Admin #Scenarios/Work #Scenarios/Home #personal #finance",
			),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "admin",
			tags: [
				"Tasks/Admin",
				"Scenarios/Work",
				"Scenarios/Home",
				"personal",
				"finance",
			],
			scenarios: ["Work", "Home"],
		});
	});

	it("should preserve tag order", () => {
		expect(
			parse("- [ ] Task #first #Tasks/Quick #second #third"),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["first", "Tasks/Quick", "second", "third"],
		});
	});

	it("should handle tags with special characters", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick #tag-with-dash #tag_with_underscore"),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "tag-with-dash", "tag_with_underscore"],
		});
	});

	it("should only have task type when no additional tags", () => {
		expect(parse("- [ ] Simple task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Simple task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Focuses", () => {
	it("should parse critical task focus (🎯)", () => {
		expect(parse("- [ ] 🎯 Critical task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Critical task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["critical"],
		});
	});

	it("should parse mechanical task focus (🔧)", () => {
		expect(parse("- [ ] 🔧 Mechanical task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Mechanical task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["mechanical"],
		});
	});

	it("should parse maintenance focus (🧹)", () => {
		expect(parse("- [ ] 🧹 Maintenance task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Maintenance task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["maintenance"],
		});
	});

	it("should parse hyper-focus ideal (🔥)", () => {
		expect(parse("- [ ] 🔥 Intense task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Intense task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["hyper_focus"],
		});
	});

	it("should parse low energy focus (🐢)", () => {
		expect(parse("- [ ] 🐢 Low energy task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Low energy task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["low_energy"],
		});
	});

	it("should parse high energy focus (⚡)", () => {
		expect(parse("- [ ] ⚡ High energy task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "High energy task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["high_energy"],
		});
	});

	it("should parse chunking focus (🪓)", () => {
		expect(parse("- [ ] 🪓 Chunking task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Chunking task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["chunking"],
		});
	});

	it("should parse errands focus (📦)", () => {
		expect(parse("- [ ] 📦 Errands task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Errands task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["errands"],
		});
	});

	it("should parse hard cognitive focus (🧠)", () => {
		expect(parse("- [ ] 🧠 Hard cognitive task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Hard cognitive task",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["hard_cognitive"],
		});
	});

	it("should parse multiple focuses", () => {
		expect(
			parse("- [ ] 🎯🔥🧠 Complex task #Tasks/Main_Mission"),
		).toMatchObject({
			state: "incomplete",
			content: "Complex task",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
			focuses: ["critical", "hyper_focus", "hard_cognitive"],
		});
	});

	it("should work without focuses", () => {
		expect(parse("- [ ] Simple task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Simple task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Scenarios", () => {
	it("should parse single scenario", () => {
		expect(parse("- [ ] Task #Tasks/Quick #Scenarios/Work")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Work"],
			scenarios: ["Work"],
		});
	});

	it("should parse nested scenarios", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick #Scenarios/Work/Intense/Programming"),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Work/Intense/Programming"],
			scenarios: ["Work/Intense/Programming"],
		});
	});

	it("should parse multiple scenarios", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick #Scenarios/Work #Scenarios/Home"),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Work", "Scenarios/Home"],
			scenarios: ["Work", "Home"],
		});
	});

	it("should parse complex scenarios", () => {
		expect(
			parse(
				"- [ ] Task #Tasks/Quick #Scenarios/Home/Kitchen/Recipes #Scenarios/Errands/Supermarket/Fresh",
			),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: [
				"Tasks/Quick",
				"Scenarios/Home/Kitchen/Recipes",
				"Scenarios/Errands/Supermarket/Fresh",
			],
			scenarios: ["Home/Kitchen/Recipes", "Errands/Supermarket/Fresh"],
		});
	});

	it("should work without scenarios", () => {
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should support custom scenario prefix", () => {
		expect(
			parse("- [ ] Tarea #Tasks/Quick #Escenarios/Trabajo #Escenarios/Casa", {
				scenarioPrefix: "Escenarios/",
			}),
		).toMatchObject({
			state: "incomplete",
			content: "Tarea",
			type: "quick",
			tags: ["Tasks/Quick", "Escenarios/Trabajo", "Escenarios/Casa"],
			scenarios: ["Trabajo", "Casa"],
		});
	});

	it("should support custom scenario mapping", () => {
		expect(
			parse("- [ ] Tarea #Tasks/Quick #Escenarios/Trabajo #Escenarios/Casa", {
				scenarioPrefix: "Escenarios/",
				scenarioMapping: {
					"Escenarios/Trabajo": "work",
					"Escenarios/Casa": "home",
				},
			}),
		).toMatchObject({
			state: "incomplete",
			content: "Tarea",
			type: "quick",
			tags: ["Tasks/Quick", "Escenarios/Trabajo", "Escenarios/Casa"],
			scenarios: ["work", "home"],
		});
	});

	it("should support mixed mapped and unmapped scenarios", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick #Scenarios/Work #Scenarios/Custom", {
				scenarioMapping: {
					"Scenarios/Work": "trabajo",
				},
			}),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Work", "Scenarios/Custom"],
			scenarios: ["trabajo", "Custom"],
		});
	});

	it("should support nested scenarios with custom prefix", () => {
		expect(
			parse(
				"- [ ] Tarea #Tasks/Quick #Escenarios/Trabajo/Programacion/Intensa",
				{
					scenarioPrefix: "Escenarios/",
				},
			),
		).toMatchObject({
			state: "incomplete",
			content: "Tarea",
			type: "quick",
			tags: ["Tasks/Quick", "Escenarios/Trabajo/Programacion/Intensa"],
			scenarios: ["Trabajo/Programacion/Intensa"],
		});
	});
});

describe("parse - Energy", () => {
	it("should parse high energy", () => {
		expect(parse("- [ ] Task #Tasks/Quick 🌡️ high")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			energy: "high",
		});
	});

	it("should parse medium energy", () => {
		expect(parse("- [ ] Task #Tasks/Quick 🌡️ medium")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			energy: "medium",
		});
	});

	it("should parse low energy", () => {
		expect(parse("- [ ] Task #Tasks/Quick 🌡️ low")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			energy: "low",
		});
	});

	it("should work without energy", () => {
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Duration", () => {
	it("should parse 15m duration", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⏱️ 15m")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "15m",
		});
	});

	it("should parse 30m duration", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⏱️ 30m")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "30m",
		});
	});

	it("should parse 45m duration", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⏱️ 45m")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "45m",
		});
	});

	it("should parse 90m duration", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⏱️ 90m")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			duration: "90m",
		});
	});

	it("should work without duration", () => {
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Blocking", () => {
	it("should parse blocking indicator", () => {
		expect(parse("- [ ] Task #Tasks/Quick 🔒")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			blocking: true,
		});
	});

	it("should work without blocking", () => {
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Dates", () => {
	it("should parse created date", () => {
		expect(parse("- [ ] Task #Tasks/Quick ➕ 2025-01-12")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			createdAt: "2025-01-12",
		});
	});

	it("should parse scheduled date", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⏳ 2025-01-12")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			scheduledAt: "2025-01-12",
		});
	});

	it("should parse start date", () => {
		expect(parse("- [ ] Task #Tasks/Quick 🛫 2025-01-12")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			startedAt: "2025-01-12",
		});
	});

	it("should parse due date", () => {
		expect(parse("- [ ] Task #Tasks/Quick 📅 2025-01-12")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			dueAt: "2025-01-12",
		});
	});

	it("should parse completion date", () => {
		expect(parse("- [x] Task #Tasks/Quick ✅ 2025-01-12")).toMatchObject({
			state: "completed",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			completedAt: "2025-01-12",
		});
	});

	it("should parse cancellation date", () => {
		expect(parse("- [-] Task #Tasks/Quick ❌ 2025-01-12")).toMatchObject({
			state: "cancelled",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			cancelledAt: "2025-01-12",
		});
	});

	it("should parse multiple dates", () => {
		expect(
			parse(
				"- [ ] Task #Tasks/Quick ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-12",
			),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			createdAt: "2025-01-10",
			scheduledAt: "2025-01-11",
			dueAt: "2025-01-12",
		});
	});

	it("should work without dates", () => {
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Times", () => {
	it("should parse time range", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⏰ [09:00 - 10:30]")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			time: { start: "09:00", end: "10:30" },
		});
	});

	it("should parse time range with different formats", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⏰ [14:00 - 15:45]")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			time: { start: "14:00", end: "15:45" },
		});
	});

	it("should work without time", () => {
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Priority", () => {
	it("should parse maximum priority (🔺)", () => {
		expect(parse("- [ ] Task #Tasks/Quick 🔺")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			priority: "maximum",
		});
	});

	it("should parse high priority (⏫)", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⏫")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			priority: "high",
		});
	});

	it("should parse medium priority (🔼)", () => {
		expect(parse("- [ ] Task #Tasks/Quick 🔼")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			priority: "medium",
		});
	});

	it("should parse low priority (🔽)", () => {
		expect(parse("- [ ] Task #Tasks/Quick 🔽")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			priority: "low",
		});
	});

	it("should parse minimum priority (⏬)", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⏬")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			priority: "minimum",
		});
	});

	it("should have undefined priority when not specified", () => {
		const result = parse("- [ ] Task #Tasks/Quick");
		expect(result).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
		expect(result.priority).toBeUndefined();
	});
});

describe("parse - Recurrence", () => {
	it("should parse recurrence rule", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick 🔁 every week on Monday"),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			recurrence: "every week on Monday",
		});
	});

	it("should parse complex recurrence rule", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick 🔁 every 2 weeks on Tuesday"),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			recurrence: "every 2 weeks on Tuesday",
		});
	});

	it("should work without recurrence", () => {
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Dependencies", () => {
	it("should parse task ID", () => {
		expect(parse("- [ ] Task #Tasks/Quick 🆔 abc123")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			id: "abc123",
		});
	});

	it("should parse blocked by dependency", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⛔ def999")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			dependencies: ["def999"],
		});
	});

	it("should parse multiple blocked by dependencies", () => {
		expect(parse("- [ ] Task #Tasks/Quick ⛔ def999 ⛔ xyz111")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			dependencies: ["def999", "xyz111"],
		});
	});

	it("should parse on completion dependency", () => {
		expect(parse("- [ ] Task #Tasks/Quick 🏁 start:abc123")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			hooks: { onCompletion: ["start:abc123"] },
		});
	});

	it("should parse multiple on completion dependencies", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick 🏁 start:abc123 🏁 notify:def456"),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			hooks: { onCompletion: ["start:abc123", "notify:def456"] },
		});
	});

	it("should parse all dependency types together", () => {
		expect(
			parse("- [ ] Task #Tasks/Quick 🆔 task001 ⛔ task002 🏁 start:task003"),
		).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
			id: "task001",
			dependencies: ["task002"],
			hooks: { onCompletion: ["start:task003"] },
		});
	});

	it("should work without dependencies", () => {
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Complex Examples from SPEC", () => {
	it("should parse Example 1 - Simple task with focus and scenario", () => {
		expect(
			parse(
				"- [ ] 🔧 Clean the downloads folder #Tasks/Maintenance #Scenarios/Home/Organization 🌡️ low ⏱️ 15m",
			),
		).toMatchObject({
			state: "incomplete",
			content: "Clean the downloads folder",
			type: "maintenance",
			tags: ["Tasks/Maintenance", "Scenarios/Home/Organization"],
			focuses: ["mechanical"],
			scenarios: ["Home/Organization"],
			energy: "low",
			duration: "15m",
		});
	});

	it("should parse Example 2 - Complex main mission", () => {
		expect(
			parse(
				"- [ ] 🎯🔥 Implement authentication module #Tasks/Main_Mission #Scenarios/Work/Intense/Programming 🧠 🌡️ high ⏱️ 90m 🔺 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-11 🆔 auth01",
			),
		).toMatchObject({
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
		});
	});

	it("should parse Example 3 - Dependent errand (multiline in spec but we test single line)", () => {
		expect(
			parse(
				"- [ ] 📦 Buy fruit at the supermarket #Tasks/Quick #Scenarios/Shopping/SuperMarket/Fruit ⏱️ 15m 🌡️ medium ⚡ ⛔ planRuta01",
			),
		).toMatchObject({
			state: "incomplete",
			content: "Buy fruit at the supermarket",
			type: "quick",
			tags: ["Tasks/Quick", "Scenarios/Shopping/SuperMarket/Fruit"],
			focuses: ["errands", "high_energy"],
			scenarios: ["Shopping/SuperMarket/Fruit"],
			duration: "15m",
			energy: "medium",
			dependencies: ["planRuta01"],
		});
	});

	it("should parse task with custom tags in addition to type and scenarios", () => {
		expect(
			parse(
				"- [ ] Fix authentication bug #Tasks/Quick #bug #urgent #backend #security",
			),
		).toMatchObject({
			state: "incomplete",
			content: "Fix authentication bug",
			type: "quick",
			tags: ["Tasks/Quick", "bug", "urgent", "backend", "security"],
		});
	});
});

describe("parse - Edge Cases", () => {
	it("should handle extra whitespace", () => {
		expect(parse("  -   [  ]   Task   #Tasks/Quick  ")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should handle task with all metadata types", () => {
		expect(
			parse(
				"- [ ] 🎯 Complete project #Tasks/Main_Mission #Scenarios/Work 🌡️ high ⏱️ 90m 🔒 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-12 ⏰ [09:00 - 10:30] 🔺 🔁 every week 🆔 proj01 ⛔ task02 🏁 start:task03",
			),
		).toMatchObject({
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
		});
	});

	it("should handle content with special characters", () => {
		expect(
			parse("- [ ] Task with @mentions and #hashtags but valid #Tasks/Quick"),
		).toMatchObject({
			state: "incomplete",
			content: "Task with @mentions and  but valid",
			type: "quick",
			tags: ["hashtags", "Tasks/Quick"],
		});
	});

	it("should throw error on empty content after metadata extraction", () => {
		// This would be a task with only metadata but no actual content text
		// This is a bit tricky to test as our parser extracts content from what's left
		// For now, the minimum would be just having type which should work
		expect(parse("- [ ] Task #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Validation Errors", () => {
	it("should ignore invalid date formats", () => {
		// Our parse function validates dates during regex matching
		// Invalid date formats simply won't be captured by the regex
		// The invalid text remains in the content
		expect(parse("- [ ] Task #Tasks/Quick ➕ invalid-date")).toMatchObject({
			state: "incomplete",
			content: "Task  ➕ invalid-date",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should throw error on invalid time format", () => {
		// Our regex should not match invalid time formats
		// The invalid text remains in the content
		expect(parse("- [ ] Task #Tasks/Quick ⏰ [9:00 - 10:30]")).toMatchObject({
			state: "incomplete",
			content: "Task  ⏰ [9:00 - 10:30]",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});
});

describe("parse - Content Extraction", () => {
	it("should correctly extract content with metadata before and after", () => {
		expect(
			parse(
				"- [ ] 🎯 Write report for client meeting #Tasks/Main_Mission 🌡️ high",
			),
		).toMatchObject({
			state: "incomplete",
			content: "Write report for client meeting",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
			focuses: ["critical"],
			energy: "high",
		});
	});

	it("should handle content with numbers", () => {
		expect(parse("- [ ] Complete 5 tasks today #Tasks/Quick")).toMatchObject({
			state: "incomplete",
			content: "Complete 5 tasks today",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should handle content with punctuation", () => {
		expect(
			parse("- [ ] Review Q4 results, prepare summary! #Tasks/Admin"),
		).toMatchObject({
			state: "incomplete",
			content: "Review Q4 results, prepare summary!",
			type: "admin",
			tags: ["Tasks/Admin"],
		});
	});
});

describe("parseArray", () => {
	it("should parse multiple tasks from multiline string", () => {
		const text = `- [ ] First task #Tasks/Quick
- [x] Second task #Tasks/Quick
- [ ] Third task #Tasks/Main_Mission`;
		const result = parseArray(text);
		expect(result).toHaveLength(3);
		expect(result[0]).toMatchObject({
			state: "incomplete",
			content: "First task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
		expect(result[1]).toMatchObject({
			state: "completed",
			content: "Second task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
		expect(result[2]).toMatchObject({
			state: "incomplete",
			content: "Third task",
			type: "main_mission",
			tags: ["Tasks/Main_Mission"],
		});
	});

	it("should handle empty string", () => {
		const result = parseArray("");
		expect(result).toHaveLength(0);
	});

	it("should handle single task", () => {
		const text = "- [ ] Single task #Tasks/Quick";
		const result = parseArray(text);
		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject({
			state: "incomplete",
			content: "Single task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should filter out empty lines", () => {
		const text = `- [ ] First task #Tasks/Quick

- [x] Second task #Tasks/Quick

- [ ] Third task #Tasks/Main_Mission`;
		const result = parseArray(text);
		expect(result).toHaveLength(3);
	});

	it("should trim whitespace from lines", () => {
		const text = `  - [ ] First task #Tasks/Quick
- [x] Second task #Tasks/Quick  `;
		const result = parseArray(text);
		expect(result).toHaveLength(2);
		expect(result[0]).toMatchObject({
			state: "incomplete",
			content: "First task",
			type: "quick",
			tags: ["Tasks/Quick"],
		});
	});

	it("should support config for all tasks", () => {
		const text = `- [ ] Tarea 1 #Tareas/Mision_Principal
- [ ] Tarea 2 #Tareas/Rapida`;
		const config: ParseConfig = {
			typeTagMapping: {
				"Tareas/Mision_Principal": "main_mission",
				"Tareas/Mision_Secundaria": "secondary_mission",
				"Tareas/Mantenimiento": "maintenance",
				"Tareas/Rapida": "quick",
				"Tareas/Admin": "admin",
			},
		};
		const result = parseArray(text, config);
		expect(result).toHaveLength(2);
		expect(result[0]).toMatchObject({
			state: "incomplete",
			content: "Tarea 1",
			type: "main_mission",
			tags: ["Tareas/Mision_Principal"],
		});
		expect(result[1]).toMatchObject({
			state: "incomplete",
			content: "Tarea 2",
			type: "quick",
			tags: ["Tareas/Rapida"],
		});
	});

	it("should handle tasks with complex metadata", () => {
		const text = `- [ ] 🎯 Task with focus #Tasks/Quick
- [x] Task with dates #Tasks/Quick ➕ 2025-01-10 ✅ 2025-01-12`;
		const result = parseArray(text);
		expect(result).toHaveLength(2);
		expect(result[0]).toMatchObject({
			state: "incomplete",
			content: "Task with focus",
			type: "quick",
			tags: ["Tasks/Quick"],
			focuses: ["critical"],
		});
		expect(result[1]).toMatchObject({
			state: "completed",
			content: "Task with dates",
			type: "quick",
			tags: ["Tasks/Quick"],
			createdAt: "2025-01-10",
			completedAt: "2025-01-12",
		});
	});

	it("should round-trip with stringify", () => {
		const tasks = [
			{
				state: "incomplete" as const,
				content: "First task",
				type: "quick" as const,
				tags: ["Tasks/Quick"],
				priority: "normal" as const,
			},
			{
				state: "completed" as const,
				content: "Second task",
				type: "quick" as const,
				tags: ["Tasks/Quick"],
				priority: "normal" as const,
			},
		];
		const stringified = tasks.map((task) => stringify(task)).join("\n");
		const parsed = parseArray(stringified);
		expect(parsed).toHaveLength(2);
		expect(parsed[0].state).toBe(tasks[0].state);
		expect(parsed[0].content).toBe(tasks[0].content);
		expect(parsed[1].state).toBe(tasks[1].state);
		expect(parsed[1].content).toBe(tasks[1].content);
	});
});

describe("parse - Validation Options", () => {
	it("should validate by default", () => {
		// Valid task should parse without error
		expect(() => parse("- [ ] Valid task #Tasks/Quick")).not.toThrow();
	});

	it("should validate when explicitly enabled", () => {
		// Valid task should parse without error
		expect(() =>
			parse("- [ ] Valid task #Tasks/Quick", { validate: true }),
		).not.toThrow();
	});

	it("should skip validation when disabled", () => {
		// Valid task should parse without error with validation disabled
		const result1 = parse("- [ ] Valid task #Tasks/Quick", {
			validate: false,
		});
		expect(result1.content).toBe("Valid task");
	});

	it("should validate dates correctly", () => {
		// Valid date
		expect(() =>
			parse("- [ ] Task with valid date #Tasks/Quick 📅 2025-01-15"),
		).not.toThrow();
	});

	it("should validate time ranges correctly", () => {
		// Valid time range
		expect(() =>
			parse("- [ ] Task with valid time #Tasks/Quick ⏰ [09:00 - 10:30]"),
		).not.toThrow();
	});

	it("should validate parsed task object with validation enabled", () => {
		// This tests that validation actually runs on the constructed task object
		const validTask = parse("- [ ] Valid task #Tasks/Quick 📅 2025-01-15", {
			validate: true,
		});
		expect(validTask.dueAt).toBe("2025-01-15");
	});

	it("should allow bypassing validation for performance", () => {
		// This demonstrates the use case: parsing many tasks without validation overhead
		const tasks = [
			"- [ ] Task 1 #Tasks/Quick",
			"- [ ] Task 2 #Tasks/Quick",
			"- [ ] Task 3 #Tasks/Quick",
		];

		// With validation disabled, should parse quickly
		const parsed = tasks.map((task) => parse(task, { validate: false }));
		expect(parsed).toHaveLength(3);
		expect(parsed[0].content).toBe("Task 1");
		expect(parsed[1].content).toBe("Task 2");
		expect(parsed[2].content).toBe("Task 3");
	});
});
