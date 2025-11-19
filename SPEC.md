
# **TaskMark v1**

## **1. Purpose**

**TaskMark v1** defines a strict Markdown syntax for describing structured tasks enriched with semantic metadata, hierarchical tags, and focus emojis. It is designed to support personal task management—especially for individuals who struggle with organization, executive function, or ADHD—by providing a clear and predictable structure that can be reliably interpreted by computer programs, humans, and AI systems alike.

The goal is to allow computer programs, humans, and AI systems to correctly interpret:

- task type,
- energy level,
- estimated duration,
- context/scenario,
- priorities,
- dates,
- dependencies,
- focus or cognitive-load signals.

The format was designed as a strict extension of the *Emoji Tasks Format* used in Obsidian.

---

## **2. General Definition of a Task**

A valid **TaskMark-v1** task follows this format:

```
- [ ] <content> <metadata...>
```

Where:

* `- [ ]` or `- [x]` represents the state.
* `<content>` is free text.
* `<metadata>` is any ordered combination of:

  * Focuses
  * Types
  * Scenarios
  * Energy
  * Duration
  * Blocking
  * Dates
  * Times
  * Priority
  * Recurrence
  * Dependencies
  * Identifiers

**General Rules:**

* Each task must be a **single line** with no line breaks.
* Emoji metadata that includes additional text should have a space after the emoji. Some parsers may ignore this, but it helps human readability.
* Metadata may appear **in any order**, provided they follow the rules of their category.
* **Nesting**: A task may be indented under another task, becoming its “child.”

---

## **3. Task States**

**Task States** define the operational condition of the item and replace the classic completion indicator (`- [ ]`, `- [x]`).

They are expressed with a single symbol inside the initial brackets:

```
- [<state>] <content> <metadata...>
```

Each state may communicate progress, cancellation, importance, or intention (add, investigate, forward, etc.).

| **State**      | **Symbol** | **Operational Meaning**                         |
| -------------- | ---------- | ----------------------------------------------- |
| Incomplete     | [ ]        | Pending task                                    |
| Completed      | [x]        | Finished task                                   |
| In progress    | [/]        | Partial or ongoing progress                     |
| Cancelled      | [-]        | Abandoned or discarded task                     |
| Forwarded      | [>]        | Moved to another date or context                |
| Migrated       | [<]        | Brought from another location                   |
| Scheduled      | [@]        | Waiting for date or event                       |
| Question       | [?]        | Needs clarification, information, or a decision |
| Important      | [!]        | Special relevance                               |
| Add / Create   | [+]        | Create something new / initiate                 |
| Research       | [R]        | Needs search, analysis, or documentation        |
| Idea           | [i]        | Early concept, not yet actionable               |
| Brainstorm     | [B]        | Divergent, exploratory work                     |
| Location-based | [L]        | Dependent on physical place                     |
| Bookmark       | [b]        | Quick reference or marker                       |

**Rules:**

* **Exactly one state** per task.
* The state must be a **single visible character**, including emojis.
* A state does **not** alter the task type; it is an operational signal, not a logical category.

---

## **4. Task Types (mandatory tag, max one)**

Represented as hierarchical tags:

| **Type**          | **Tag**                   |
| ----------------- | ------------------------- |
| Main Mission      | #Tasks/Main_Mission  |
| Secondary Mission | #Tasks/Secondary_Mission |
| Maintenance       | #Tasks/Maintenance     |
| Quick Task        | #Tasks/Quick            |
| Admin             | #Tasks/Admin    |

**Rules:**

* A task may have **only one** type.
* It must appear exactly once.

---

## **5. Focuses (zero or several)**

Expressed using emojis placed in plain text.

| **Focus**           | **Emoji** |
| ------------------- | --------- |
| Critical task       | 🎯        |
| Mechanical task     | 🔧        |
| Maintenance         | 🧹        |
| Hyper-focus ideal   | 🔥        |
| Low energy          | 🐢        |
| High energy         | ⚡         |
| Chunking            | 🪓        |
| Errands             | 📦        |
| Hard cognitive task | 🧠        |

**Rules:**

* Multiple focuses allowed.
* Must appear **at the beginning or end** of content, before dates.
* Order does not alter meaning.

---

## **6. Scenarios (zero or several)**

Hierarchical tags under `#Scenarios/...`

Examples:

* #Scenarios/Work/Intense/Programming
* #Scenarios/Home/Kitchen/Recipes
* #Scenarios/Errands/Supermarket/Fresh
* #Scenarios/Leisure/Café

**Rules:**

1. Any number of scenarios may be included.
2. Scenarios describe the situational or environmental context in which the task is best performed.
3. It is recommended to use the most specific level available.

---

## **7. Energy**

Allowed values:

* 🌡️ high
* 🌡️ medium
* 🌡️ low

**Rules:**

* Maximum one per task.
* Indicates ideal energy state of the executor.

---

## **8. Duration**

Allowed values:

* ⏱️ 15m
* ⏱️ 30m
* ⏱️ 45m
* ⏱️ 90m

**Rules:**

* Maximum one duration per task.
* Larger tasks must be split or marked with 🪓.

---

## **9. Blocking**

Marked with:

* 🔒

Indicates the task blocks others or must be completed first.

**Rules:**

* May coexist with formal dependencies.

---

## **10. Dates**

Based on Obsidian Tasks standard.

| **Type**     | **Symbol**  | **Example**    |
| ------------ | ----------- | -------------  |
| Created      | ➕          | ➕ 2025-01-12  |
| Scheduled    | ⏳          | ⏳ 2025-01-12  |
| Start        | 🛫          | 🛫 2025-01-12  |
| Due          | 📅          | 📅 2025-01-12  |
| Completion   | ✅          | ✅ 2025-01-12  |
| Cancellation | ❌          | ❌ 2025-01-12  |

**Rules:**

* All optional.
* Mandatory format: **YYYY-MM-DD**.

---

## **11. Times**

Represented with:

* ⏰ [hh:mm - hh:mm]

Where the first segment is start time and the second is end time.

**Rules:**

* Must use two-digit hours and minutes (leading zero if needed).
* The range must be enclosed in brackets.

---

## **12. Priorities**

* 🔺 maximum
* ⏫ high
* 🔼 medium
* *(no emoji)* normal
* 🔽 low
* ⏬ minimum

**Rules:**

* Only one per task.
* If none → “normal.”

---

## **13. Recurrence**

Represented as:

* 🔁 `<rule>`

Example:

```
🔁 every week on Monday
```

Must follow Obsidian Tasks recurrence rules.

---

## **14. Dependencies**

Three possible elements:

| **Element**   | **Symbol** | **Example**     |
| ------------- | ---------- | --------------- |
| ID            | 🆔         | 🆔 abc123       |
| Blocked by    | ⛔         | ⛔ def999       |
| On completion | 🏁         | 🏁 start:abc123 |

**Rules:**

* IDs must be alphanumeric strings without spaces.
* Multiple dependencies allowed.

---

## **15. Allowed General Structure**

A complete task may look like:

```
- [ ] 🎯 Write the quarterly report 🧠 #Tasks/Main_Mission #Scenarios/Work/Intense/Writing ⏱️90m 🌡️high 🔺 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-12 🆔 inf01
```

Metadata may be freely ordered as long as they follow their category rules.

---

## **16. TaskMark-v1 Compliance Rules**

A task is valid if it meets:

1. **Mandatory initial state**.
2. **Non-empty content**.
3. **Max one type** (#Tasks/…).
4. **Max one energy value**.
5. **Max one duration**.
6. **Max one priority**.
7. **Multiple focuses allowed**.
8. **Unlimited scenarios**.
9. **Unlimited dates**.
10. **Recurrence: max one rule**.
11. **Dependencies: unlimited**.
12. **IDs unique within the same document**.

---

## **17. Official Examples**

### Example 1 — Simple task with focus and scenario

```
- [ ] 🔧 Clean the downloads folder #Tasks/Maintenance #Scenarios/Home/Organization 🌡️low ⏱️15m
```

### Example 2 — Complex main mission

```
- [ ] 🎯🔥 Implement authentication module #Tasks/Main_Mission #Scenarios/Work/Intense/Programming 🧠 🌡️high ⏱️90m 🔺 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-11 🆔 auth01
```

### Example 3 — Dependent errand

```
- [ ] 📦 Buy fruit at the supermarket #Tasks/Quick #Scenarios/Shopping/SuperMarket/Fruit
      ⏱️15m 🌡️medium ⚡
      ⛔ planRuta01
```

---

## **18. Standard Version**

* **Name:** TaskMark
* **Version:** v1
* **Date:** 2025-11
* **Standard Author:** Aitor Llamas Jiménez
