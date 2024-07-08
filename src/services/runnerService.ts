export const runCode = async (
  challenge: any,
  testNumber: number
): Promise<{ result: any; challenge: any }> => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ challenge, testNumber }),
  };

  let result = {};
  try {
    const response: any = await fetch(
      process.env.RUNNER_URL + "/run_code",
      requestOptions
    ).then((res) => res.json());
    challenge = response.challenge;
    result = response.result || {};
  } catch (e) {
    result = {
      error:
        "Error when running test in the runner, This is not an error in the code.",
      testCasesPassPython: false,
      compilationSuccess: false,
    };
  }
  return { result, challenge };
};

export const runTest = async (
  challenge: any
): Promise<{ testResult: any; challenge: any }> => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ challenge }),
  };

  let testResult = {};
  try {
    const response: any = await fetch(
      process.env.RUNNER_URL + "/run_test",
      requestOptions
    ).then((res) => res.json());
    challenge = response.challenge;
    testResult = response.testResult || {};
  } catch (e) {
    const err = e as Error;

    testResult = {
      error: err.message,
      // "Error when running test cases in the runner, This is not an error in the code.",
      testCasesPassPython: false,
      testOutput: "",
      testError: "",
      compilationSuccess: false,
      testCaseResults: [],
    };
  }
  return { testResult, challenge };
};
