# - [x] TaskMark

> **A Markdown-based specification for structured task management.** TaskMark turns your scattered thoughts into structured, actionable tasks that your brain—and your code—can actually understand.

## What Makes TaskMark Special?

TaskMark-v1 is a **strict Markdown syntax specification** for describing tasks enriched with semantic metadata. It's not just another task format—it's a **cognitive ally** designed from the ground up for the way real brains work, especially those that need a little extra structure.

Imagine having:
- **Tasks that speak both human and machine** - Write naturally, parse programmatically
- **Visual clarity through emojis** - Your brain processes icons 60,000x faster than text
- **Hierarchical organization** - Projects, areas, missions—all beautifully nested
- **Rich metadata** - Energy levels, time estimates, deadlines, and focus states
- **Strict but friendly syntax** - Predictable structure that computers, humans, and AI all understand

Whether you're building a productivity app, managing ADHD, or just tired of losing track of what matters—TaskMark has your back.

---

## Jump Right In

<table>
<tr>
<td width="33%" align="center">

### [Getting Started](getting-started.md)
Install, configure, and start using TaskMark in minutes

</td>
<td width="33%" align="center">

### [API Reference](api.md)
Complete API documentation with real-world examples

</td>
<td width="33%" align="center">

### [Contributing](../CONTRIBUTING.md)
Join us in building the future of task management

</td>
</tr>
</table>

---

## See It In Action

```typescript
import { parse, stringify } from 'taskmark';

// Parse a rich, semantic task in one line
const task = parse('- [ ] 🎯 Write report #Tasks/Main_Mission 🌡️ high ⏱️ 90m 📅 2025-01-20');

console.log(task);
// {
//   content: "Write report",
//   type: "main_mission",
//   focuses: ["critical"],
//   energy: "high",
//   duration: "90m",
//   dueAt: "2025-01-20"
// }

// Convert back to TaskMark format
const taskString = stringify(task);
// "- [ ] 🎯 Write report #Tasks/Main_Mission 🌡️ high ⏱️ 90m 📅 2025-01-20"
```

**That's it.** One simple format. Infinite possibilities.

---

## Why Developers Love TaskMark

<table>
<tr>
<td>

### **100% Spec Compliant**
Full TaskMark-v1 implementation with zero compromises

</td>
<td>

### **TypeScript Native**
Comprehensive type definitions. IntelliSense everywhere.

</td>
</tr>
<tr>
<td>

### **Parse & Stringify**
Seamlessly convert between strings and structured objects

</td>
<td>

### **Rich Utilities**
Helper functions that make task manipulation effortless

</td>
</tr>
<tr>
<td>

### **Internationalization**
Custom tags and scenario prefixes for any language

</td>
<td>

### **Zod Validation**
Runtime type safety that catches errors before they bite

</td>
</tr>
<tr>
<td>

### **Universal Compatibility**
Works with ESM and CommonJS—because we're not fighting about modules

</td>
<td>

### **Zero Dependencies**
Small bundle size. Fast performance. No surprises.

</td>
</tr>
</table>

---

## The Specification

Want to understand TaskMark at its core? The complete **[TaskMark-v1 Specification](SPEC.md)** defines:

- Task structure and formatting rules
- All supported states, types, focuses, and metadata
- Validation requirements and edge cases
- Official examples and best practices

---

## Ready to Start?

```bash
npm install taskmark
```

**That's all you need.** Now go build something amazing.

---

## License

MIT - Use it, love it, share it.
