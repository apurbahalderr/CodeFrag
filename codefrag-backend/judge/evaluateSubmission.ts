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
evaluateSubmission(
  `import java.util.Scanner;
   public class Solution {
     public static void main(String[] args) {
       Scanner sc = new Scanner(System.in);
       int a = sc.nextInt();
       int b = sc.nextInt();
       System.out.println(a + b);
     }
   }`,
  "java",
  [
    { input: "3 5", expectedOutput: "8" },
    { input: "10 20", expectedOutput: "30" },
    { input: "1 1", expectedOutput: "3" }, // deliberately wrong, to confirm failure detection works
  ],
).then((results) => console.log(JSON.stringify(results, null, 2)));
