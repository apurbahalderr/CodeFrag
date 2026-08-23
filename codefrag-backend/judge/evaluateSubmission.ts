import { runSubmission } from "./runSubmission";
export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface TestResult {
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
}

export async function evaluateSubmission(
  code: string,
  language: "cpp" | "java",
  testCases: TestCase[],
): Promise<TestResult[]> {
  const results: TestResult[] = [];
  for (const testcase of testCases) {
    try {
      const actualOutput = await runSubmission(code, testcase.input, language);
      const passed = actualOutput.trim() === testcase.expectedOutput.trim();
      results.push({
        passed,
        actualOutput,
        expectedOutput: testcase.expectedOutput,
      });
    } catch (error) {
      results.push({
        passed: false,
        actualOutput: "",
        expectedOutput: testcase.expectedOutput,
      });
    }
  }

  return results;
}
