import { parse } from '../src/parse';

// Test cases with varying complexity
const testCases = [
  // Simple task
  {
    name: 'Simple task',
    input: '- [ ] Simple task #Tasks/Quick',
  },
  // Task with focus
  {
    name: 'Task with focus',
    input: '- [ ] 🎯 Critical task #Tasks/Main_Mission',
  },
  // Task with multiple focuses
  {
    name: 'Task with multiple focuses',
    input: '- [ ] 🎯🔥🧠 Complex task #Tasks/Main_Mission',
  },
  // Task with all metadata
  {
    name: 'Task with all metadata',
    input:
      '- [ ] 🎯 Complete project #Tasks/Main_Mission #Scenarios/Work 🌡️ high ⏱️ 90m 🔒 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-12 ⏰ [09:00 - 10:30] 🔺 🔁 every week 🆔 proj01 ⛔ task02 🏁 start:task03',
  },
  // Task with many tags
  {
    name: 'Task with many tags',
    input:
      '- [ ] Fix bug #Tasks/Quick #bug #urgent #backend #security #frontend #api #database #performance',
  },
  // Task with multiple scenarios
  {
    name: 'Task with multiple scenarios',
    input:
      '- [ ] Task #Tasks/Admin #Scenarios/Work #Scenarios/Home #Scenarios/Personal #Scenarios/Errands',
  },
  // Task with dates
  {
    name: 'Task with dates',
    input:
      '- [ ] Task #Tasks/Quick ➕ 2025-01-10 ⏳ 2025-01-11 🛫 2025-01-12 📅 2025-01-13 ✅ 2025-01-14 ❌ 2025-01-15',
  },
  // Complex task from SPEC
  {
    name: 'Complex task from SPEC',
    input:
      '- [ ] 🎯🔥 Implement authentication module #Tasks/Main_Mission #Scenarios/Work/Intense/Programming 🧠 🌡️ high ⏱️ 90m 🔺 ➕ 2025-01-10 ⏳ 2025-01-11 📅 2025-01-11 🆔 auth01',
  },
];

interface BenchmarkResult {
  name: string;
  time: number;
  opsPerSecond: number;
}

function benchmark(fn: (input: string) => unknown, input: string, iterations: number): number {
  // Warmup
  for (let i = 0; i < 10; i++) {
    fn(input);
  }

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn(input);
  }
  const end = performance.now();

  return end - start;
}

function runBenchmark(iterations = 10000): BenchmarkResult[] {
  const results: BenchmarkResult[] = [];

  console.log(
    `\n🚀 Running benchmarks with ${iterations.toLocaleString()} iterations per test case...\n`
  );

  for (const testCase of testCases) {
    // Verify the function works correctly
    try {
      parse(testCase.input);
    } catch (error) {
      console.error(`❌ Error parsing "${testCase.name}":`, error);
      continue;
    }

    const time = benchmark(parse, testCase.input, iterations);
    const opsPerSecond = (iterations / time) * 1000; // operations per second

    results.push({
      name: testCase.name,
      time,
      opsPerSecond,
    });
  }

  return results;
}

function printResults(results: BenchmarkResult[]): void {
  console.log('📊 Benchmark Results:\n');
  console.log('Test Case'.padEnd(40) + 'Time (ms)'.padEnd(20) + 'Ops/sec'.padEnd(20));
  console.log('-'.repeat(80));

  let totalTime = 0;
  let totalOps = 0;

  for (const result of results) {
    totalTime += result.time;
    totalOps += result.opsPerSecond;

    console.log(
      result.name.padEnd(40) +
        result.time.toFixed(2).padEnd(20) +
        Math.round(result.opsPerSecond).toLocaleString().padEnd(20)
    );
  }

  console.log('-'.repeat(80));
  const avgOpsPerSecond = totalOps / results.length;

  console.log(
    'TOTAL'.padEnd(40) +
      totalTime.toFixed(2).padEnd(20) +
      Math.round(avgOpsPerSecond).toLocaleString().padEnd(20)
  );

  console.log('\n✨ Summary:');
  console.log(`   Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`   Average ops/sec: ${Math.round(avgOpsPerSecond).toLocaleString()}\n`);
}

// Run benchmarks with multiple iteration counts for better accuracy
console.log('='.repeat(100));
console.log('FIRST RUN: 10,000 iterations');
console.log('='.repeat(100));
const results1 = runBenchmark(10000);
printResults(results1);

console.log(`\n${'='.repeat(100)}`);
console.log('SECOND RUN: 50,000 iterations (more accurate)');
console.log('='.repeat(100));
const results2 = runBenchmark(50000);
printResults(results2);
