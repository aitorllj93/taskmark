import { describe, expect, it } from 'vitest';
import {
  addDependency,
  addFocus,
  addTag,
  markAsCompleted,
  markAsIncomplete,
  removeDependency,
  removeDueDate,
  removeDuration,
  removeEnergy,
  removeFocus,
  removeScheduledDate,
  removeStartedDate,
  removeTag,
  removeTimeRange,
  setBlocking,
  setDueDate,
  setDuration,
  setEnergy,
  setPriority,
  setScheduledDate,
  setStartedDate,
  setState,
  setTimeRange,
} from './utils';

describe('markAsCompleted', () => {
  it('should mark a simple task as completed', () => {
    const task = '- [ ] Buy groceries #Tasks/Quick';
    const result = markAsCompleted(task);
    expect(result).toMatch(/^- \[x\] Buy groceries #Tasks\/Quick ✅ \d{4}-\d{2}-\d{2}$/);
  });

  it('should mark a task as completed with a specific date', () => {
    const task = '- [ ] Buy groceries #Tasks/Quick';
    const result = markAsCompleted(task, '2025-01-20');
    expect(result).toBe('- [x] Buy groceries #Tasks/Quick ✅ 2025-01-20');
  });

  it('should replace existing completion date', () => {
    const task = '- [x] Buy groceries #Tasks/Quick ✅ 2025-01-15';
    const result = markAsCompleted(task, '2025-01-20');
    expect(result).toBe('- [x] Buy groceries #Tasks/Quick ✅ 2025-01-20');
  });

  it('should handle task with other metadata', () => {
    const task = '- [ ] Buy groceries #Tasks/Quick 🌡️ high ⏱️ 30m';
    const result = markAsCompleted(task, '2025-01-20');
    expect(result).toBe('- [x] Buy groceries #Tasks/Quick 🌡️ high ⏱️ 30m ✅ 2025-01-20');
  });

  it('should handle task with dates', () => {
    const task = '- [ ] Task #Tasks/Quick ➕ 2025-01-10 ⏳ 2025-01-15 📅 2025-01-20';
    const result = markAsCompleted(task, '2025-01-22');
    expect(result).toContain('✅ 2025-01-22');
    expect(result).toContain('- [x]');
  });

  it('should insert completion date before dependencies', () => {
    const task = '- [ ] Task #Tasks/Quick 🆔 task01 ⛔ task02';
    const result = markAsCompleted(task, '2025-01-20');
    expect(result).toMatch(/✅ 2025-01-20.*🆔/);
  });

  it('should handle task already completed', () => {
    const task = '- [x] Buy groceries #Tasks/Quick ✅ 2025-01-15';
    const result = markAsCompleted(task, '2025-01-20');
    expect(result).toBe('- [x] Buy groceries #Tasks/Quick ✅ 2025-01-20');
  });

  it('should handle task with in_progress state', () => {
    const task = '- [/] Working on task #Tasks/Main_Mission';
    const result = markAsCompleted(task, '2025-01-20');
    expect(result).toBe('- [x] Working on task #Tasks/Main_Mission ✅ 2025-01-20');
  });

  it('should handle complex task with all metadata', () => {
    const task =
      '- [ ] 🎯 Complete project #Tasks/Main_Mission #Scenarios/Work 🌡️ high ⏱️ 90m 🔒 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-12 ⏰ [09:00 - 10:30] 🔺 🔁 every week 🆔 proj01 ⛔ task02 🏁 start:task03';
    const result = markAsCompleted(task, '2025-01-15');
    expect(result).toContain('- [x]');
    expect(result).toContain('✅ 2025-01-15');
    // Should preserve other metadata
    expect(result).toContain('🎯');
    expect(result).toContain('#Tasks/Main_Mission');
    expect(result).toContain('🆔 proj01');
  });
});

describe('setScheduledDate', () => {
  it('should add scheduled date to a simple task', () => {
    const task = '- [ ] Buy groceries #Tasks/Quick';
    const result = setScheduledDate(task, '2025-01-20');
    expect(result).toBe('- [ ] Buy groceries #Tasks/Quick ⏳ 2025-01-20');
  });

  it('should replace existing scheduled date', () => {
    const task = '- [ ] Task #Tasks/Quick ⏳ 2025-01-15';
    const result = setScheduledDate(task, '2025-01-20');
    expect(result).toBe('- [ ] Task #Tasks/Quick ⏳ 2025-01-20');
  });

  it('should handle task with other metadata', () => {
    const task = '- [ ] Task #Tasks/Quick 🌡️ high ⏱️ 30m';
    const result = setScheduledDate(task, '2025-01-20');
    expect(result).toContain('⏳ 2025-01-20');
  });

  it('should insert scheduled date after other dates', () => {
    const task = '- [ ] Task #Tasks/Quick ➕ 2025-01-10 📅 2025-01-20';
    const result = setScheduledDate(task, '2025-01-15');
    // Should be inserted after the last date (due date)
    const dueIndex = result.indexOf('📅');
    const scheduledIndex = result.indexOf('⏳');
    expect(scheduledIndex).toBeGreaterThan(dueIndex);
  });

  it('should insert scheduled date before recurrence/id/dependencies', () => {
    const task = '- [ ] Task #Tasks/Quick 🔁 every week 🆔 task01';
    const result = setScheduledDate(task, '2025-01-20');
    const scheduledIndex = result.indexOf('⏳');
    const recurrenceIndex = result.indexOf('🔁');
    expect(scheduledIndex).toBeLessThan(recurrenceIndex);
  });

  it('should validate date format', () => {
    const task = '- [ ] Task #Tasks/Quick';
    expect(() => setScheduledDate(task, 'invalid-date')).toThrow('Invalid date format');
    expect(() => setScheduledDate(task, '2025/01/20')).toThrow('Invalid date format');
    expect(() => setScheduledDate(task, '25-01-20')).toThrow('Invalid date format');
  });

  it('should handle task with multiple dates', () => {
    const task = '- [ ] Task #Tasks/Quick ➕ 2025-01-10 🛫 2025-01-12 📅 2025-01-15';
    const result = setScheduledDate(task, '2025-01-11');
    // Should be inserted after the last date (due date)
    expect(result).toContain('⏳ 2025-01-11');
    // Should only have one scheduled date
    const matches = result.match(/⏳/g);
    expect(matches).toHaveLength(1);
  });

  it('should handle task with no existing dates', () => {
    const task = '- [ ] Task #Tasks/Quick 🔺';
    const result = setScheduledDate(task, '2025-01-20');
    expect(result).toContain('⏳ 2025-01-20');
  });
});

describe('removeScheduledDate', () => {
  it('should remove scheduled date from a task', () => {
    const task = '- [ ] Task #Tasks/Quick ⏳ 2025-01-20';
    const result = removeScheduledDate(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });

  it('should handle task without scheduled date', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = removeScheduledDate(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });

  it('should handle task with multiple dates', () => {
    const task = '- [ ] Task #Tasks/Quick ➕ 2025-01-10 ⏳ 2025-01-15 📅 2025-01-20';
    const result = removeScheduledDate(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick ➕ 2025-01-10 📅 2025-01-20');
  });

  it('should handle task with extra whitespace', () => {
    const task = '- [ ] Task #Tasks/Quick ⏳  2025-01-20  ';
    const result = removeScheduledDate(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });
});

describe('markAsIncomplete', () => {
  it('should mark a completed task as incomplete', () => {
    const task = '- [x] Buy groceries #Tasks/Quick';
    const result = markAsIncomplete(task);
    expect(result).toBe('- [ ] Buy groceries #Tasks/Quick');
  });

  it('should handle task with in_progress state', () => {
    const task = '- [/] Working on task #Tasks/Main_Mission';
    const result = markAsIncomplete(task);
    expect(result).toBe('- [ ] Working on task #Tasks/Main_Mission');
  });

  it('should handle task with other states', () => {
    const task = '- [@] Scheduled task #Tasks/Quick';
    const result = markAsIncomplete(task);
    expect(result).toBe('- [ ] Scheduled task #Tasks/Quick');
  });

  it('should handle task already incomplete', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = markAsIncomplete(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });

  it('should preserve all metadata', () => {
    const task = '- [x] Task #Tasks/Quick ✅ 2025-01-20 🌡️ high';
    const result = markAsIncomplete(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick ✅ 2025-01-20 🌡️ high');
  });
});

describe('setState', () => {
  it('should set state to in_progress', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = setState(task, 'in_progress');
    expect(result).toBe('- [/] Task #Tasks/Quick');
  });

  it('should set state to cancelled', () => {
    const task = '- [x] Task #Tasks/Quick';
    const result = setState(task, 'cancelled');
    expect(result).toBe('- [-] Task #Tasks/Quick');
  });

  it('should set state to scheduled', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = setState(task, 'scheduled');
    expect(result).toBe('- [@] Task #Tasks/Quick');
  });

  it('should throw error on invalid state', () => {
    const task = '- [ ] Task #Tasks/Quick';
    expect(() => setState(task, 'invalid')).toThrow('Invalid state');
  });
});

describe('setDueDate', () => {
  it('should add due date to a task', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = setDueDate(task, '2025-01-20');
    expect(result).toBe('- [ ] Task #Tasks/Quick 📅 2025-01-20');
  });

  it('should replace existing due date', () => {
    const task = '- [ ] Task #Tasks/Quick 📅 2025-01-15';
    const result = setDueDate(task, '2025-01-20');
    expect(result).toBe('- [ ] Task #Tasks/Quick 📅 2025-01-20');
  });

  it('should validate date format', () => {
    const task = '- [ ] Task #Tasks/Quick';
    expect(() => setDueDate(task, 'invalid')).toThrow('Invalid date format');
  });
});

describe('removeDueDate', () => {
  it('should remove due date', () => {
    const task = '- [ ] Task #Tasks/Quick 📅 2025-01-20';
    const result = removeDueDate(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });
});

describe('setStartedDate', () => {
  it('should add started date', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = setStartedDate(task, '2025-01-20');
    expect(result).toBe('- [ ] Task #Tasks/Quick 🛫 2025-01-20');
  });

  it('should replace existing started date', () => {
    const task = '- [ ] Task #Tasks/Quick 🛫 2025-01-15';
    const result = setStartedDate(task, '2025-01-20');
    expect(result).toBe('- [ ] Task #Tasks/Quick 🛫 2025-01-20');
  });
});

describe('removeStartedDate', () => {
  it('should remove started date', () => {
    const task = '- [ ] Task #Tasks/Quick 🛫 2025-01-20';
    const result = removeStartedDate(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });
});

describe('setPriority', () => {
  it('should set priority to high', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = setPriority(task, 'high');
    expect(result).toBe('- [ ] Task #Tasks/Quick ⏫');
  });

  it('should set priority to maximum', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = setPriority(task, 'maximum');
    expect(result).toBe('- [ ] Task #Tasks/Quick 🔺');
  });

  it('should set priority to normal (removes emoji)', () => {
    const task = '- [ ] Task #Tasks/Quick ⏫';
    const result = setPriority(task, 'normal');
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });

  it('should replace existing priority', () => {
    const task = '- [ ] Task #Tasks/Quick ⏫';
    const result = setPriority(task, 'low');
    expect(result).toBe('- [ ] Task #Tasks/Quick 🔽');
  });

  it('should throw error on invalid priority', () => {
    const task = '- [ ] Task #Tasks/Quick';
    expect(() => setPriority(task, 'invalid')).toThrow('Invalid priority');
  });
});

describe('setEnergy', () => {
  it('should set energy to high', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = setEnergy(task, 'high');
    expect(result).toBe('- [ ] Task #Tasks/Quick 🌡️ high');
  });

  it('should replace existing energy', () => {
    const task = '- [ ] Task #Tasks/Quick 🌡️ low';
    const result = setEnergy(task, 'high');
    expect(result).toBe('- [ ] Task #Tasks/Quick 🌡️ high');
  });

  it('should throw error on invalid energy', () => {
    const task = '- [ ] Task #Tasks/Quick';
    expect(() => setEnergy(task, 'invalid')).toThrow('Invalid energy');
  });
});

describe('removeEnergy', () => {
  it('should remove energy', () => {
    const task = '- [ ] Task #Tasks/Quick 🌡️ high';
    const result = removeEnergy(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });
});

describe('setDuration', () => {
  it('should set duration', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = setDuration(task, '30m');
    expect(result).toBe('- [ ] Task #Tasks/Quick ⏱️ 30m');
  });

  it('should replace existing duration', () => {
    const task = '- [ ] Task #Tasks/Quick ⏱️ 15m';
    const result = setDuration(task, '90m');
    expect(result).toBe('- [ ] Task #Tasks/Quick ⏱️ 90m');
  });
});

describe('removeDuration', () => {
  it('should remove duration', () => {
    const task = '- [ ] Task #Tasks/Quick ⏱️ 30m';
    const result = removeDuration(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });
});

describe('setBlocking', () => {
  it('should add blocking flag', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = setBlocking(task, true);
    expect(result).toBe('- [ ] Task #Tasks/Quick 🔒');
  });

  it('should remove blocking flag', () => {
    const task = '- [ ] Task #Tasks/Quick 🔒';
    const result = setBlocking(task, false);
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });

  it('should not duplicate blocking flag', () => {
    const task = '- [ ] Task #Tasks/Quick 🔒';
    const result = setBlocking(task, true);
    expect(result).toBe('- [ ] Task #Tasks/Quick 🔒');
  });
});

describe('addFocus', () => {
  it('should add critical focus', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = addFocus(task, 'critical');
    expect(result).toContain('🎯');
  });

  it('should not duplicate focus', () => {
    const task = '- [ ] 🎯 Task #Tasks/Quick';
    const result = addFocus(task, 'critical');
    expect(result).toBe(task);
  });

  it('should throw error on invalid focus', () => {
    const task = '- [ ] Task #Tasks/Quick';
    expect(() => addFocus(task, 'invalid')).toThrow('Invalid focus');
  });
});

describe('removeFocus', () => {
  it('should remove focus', () => {
    const task = '- [ ] 🎯 Task #Tasks/Quick';
    const result = removeFocus(task, 'critical');
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });

  it('should throw error on invalid focus', () => {
    const task = '- [ ] Task #Tasks/Quick';
    expect(() => removeFocus(task, 'invalid')).toThrow('Invalid focus');
  });
});

describe('addTag', () => {
  it('should add a tag', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = addTag(task, 'urgent');
    expect(result).toBe('- [ ] Task #Tasks/Quick #urgent');
  });

  it('should not duplicate tag', () => {
    const task = '- [ ] Task #Tasks/Quick #urgent';
    const result = addTag(task, 'urgent');
    expect(result).toBe(task);
  });
});

describe('removeTag', () => {
  it('should remove a tag', () => {
    const task = '- [ ] Task #Tasks/Quick #urgent';
    const result = removeTag(task, 'urgent');
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });
});

describe('setTimeRange', () => {
  it('should set time range', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = setTimeRange(task, '09:00', '10:30');
    expect(result).toBe('- [ ] Task #Tasks/Quick ⏰ [09:00 - 10:30]');
  });

  it('should replace existing time range', () => {
    const task = '- [ ] Task #Tasks/Quick ⏰ [09:00 - 10:00]';
    const result = setTimeRange(task, '09:00', '10:30');
    expect(result).toBe('- [ ] Task #Tasks/Quick ⏰ [09:00 - 10:30]');
  });

  it('should validate time format', () => {
    const task = '- [ ] Task #Tasks/Quick';
    expect(() => setTimeRange(task, '9:00', '10:30')).toThrow('Invalid time format');
  });
});

describe('removeTimeRange', () => {
  it('should remove time range', () => {
    const task = '- [ ] Task #Tasks/Quick ⏰ [09:00 - 10:30]';
    const result = removeTimeRange(task);
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });
});

describe('addDependency', () => {
  it('should add a dependency', () => {
    const task = '- [ ] Task #Tasks/Quick';
    const result = addDependency(task, 'task01');
    expect(result).toBe('- [ ] Task #Tasks/Quick ⛔ task01');
  });

  it('should not duplicate dependency', () => {
    const task = '- [ ] Task #Tasks/Quick ⛔ task01';
    const result = addDependency(task, 'task01');
    expect(result).toBe(task);
  });
});

describe('removeDependency', () => {
  it('should remove a dependency', () => {
    const task = '- [ ] Task #Tasks/Quick ⛔ task01';
    const result = removeDependency(task, 'task01');
    expect(result).toBe('- [ ] Task #Tasks/Quick');
  });
});
