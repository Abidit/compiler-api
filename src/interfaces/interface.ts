export interface ChallengeTestInterface {
  actualOutput: string;
  input: string;
  output: string;
  testPassed: boolean;
}

export interface ChallengeExecutionInterface {
  actualOutput: string;
  allAvailableTestsPassed: boolean;
  compilationSuccess: boolean;
  error: string | null;
  testPass: boolean;
  testCasesPassPython: boolean;
  tests: ChallengeTestInterface[];
}

export interface TestChallengeExecutionInterface {
  testOutput: string;
  allAvailableTestsPassed: boolean;
  compilationSuccess: boolean;
  testError: string | null;
  testPass: boolean;
  error: string | null;
  testCasesPassPython: boolean;
  testCaseResults: ChallengeTestInterface[];
}
