import { describe, expect, it } from 'vitest';
import { parse } from './index';

describe('TaskMark exports', () => {
  it('should export parse function', () => {
    expect(parse).toBeDefined();
    expect(typeof parse).toBe('function');
  });

  it('should parse a simple task through main export', () => {
    const result = parse('- [ ] Test task #Tasks/Quick');
    expect(result.content).toBe('Test task');
    expect(result.type).toBe('quick');
    expect(result.state).toBe('incomplete');
  });
});
