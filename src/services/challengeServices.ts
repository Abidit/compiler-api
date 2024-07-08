import {
  CreateTableChallengesQuery,
  generateInsertQuery,
} from "../constants/dbConsts";
import {
  serializeFnPython,
  deserializeFnPython,
  mockFunction,
  preCodeForRawExecutionPython,
  serializeFnJs,
  deserializeFnJs,
  serializeFnJava,
  deserializeFnJava,
  serializeFnC,
  deserializeFnC,
  deserializeFnCpp,
  serializeFnCpp,
} from "../constants/fnConsts";
import { promises, readFileSync, writeFileSync } from "fs";
import path from "path";
import { uuidv4 } from "../utils/helpers";

import yaml from "yaml";
import { runCode, runTest } from "./runnerService";

const challengesPath = "../db/challenges.yaml";
const playerChallenges = "../db/player_challenges.yaml";

export const emptyChallenges = () => {
  const emptyContent = "[]";
  writeFileSync(path.resolve(__dirname, challengesPath), emptyContent, "utf8");
};

export const emptyPlayerChallenges = () => {
  const emptyContent = "[]";
  writeFileSync(
    path.resolve(__dirname, playerChallenges),
    emptyContent,
    "utf8"
  );
};

export const deletePlayerChallenge = (id: string) => {
  const fileContent = readFileSync(
    path.resolve(__dirname, playerChallenges),
    "utf8"
  );

  return new Promise((resolve, reject) => {
    let data = yaml.parse(fileContent) || [];
    data = data.filter((challenge: any) => {
      return challenge.id !== id;
    });

    const yamlStr = yaml.stringify(data);
    writeFileSync(path.resolve(__dirname, playerChallenges), yamlStr, "utf8");
    resolve({ deletedChallenge: id });
  });
};

export const deleteChallenge = (id: string) => {
  const fileContent = readFileSync(
    path.resolve(__dirname, challengesPath),
    "utf8"
  );
  return new Promise((resolve, reject) => {
    let data = yaml.parse(fileContent) || [];
    data = data.filter((challenge: any) => {
      return challenge.id !== id;
    });

    const yamlStr = yaml.stringify(data);
    writeFileSync(path.resolve(__dirname, challengesPath), yamlStr, "utf8");
    resolve({ deletedChallenge: id });
  });
};

export const appendToPlayedChallenges = async (challenge: any) => {
  if (!challenge.id) {
    challenge.id = uuidv4();
  }
  const fileContent = await promises.readFile(
    path.resolve(__dirname, playerChallenges),
    "utf8"
  );
  const data = yaml.parse(fileContent) || [];
  data.push(challenge);

  const yamlStr = yaml.stringify(data);
  writeFileSync(path.resolve(__dirname, playerChallenges), yamlStr, "utf8");
};

export const getAllChallenges = () => {
  const fileContent = readFileSync(
    path.resolve(__dirname, challengesPath),
    "utf8"
  );
  const data = yaml.parse(fileContent) || [];
  return data;
};

export const getPlayerChallenges = () => {
  const fileContent = readFileSync(
    path.resolve(__dirname, playerChallenges),
    "utf8"
  );
  const data = yaml.parse(fileContent) || [];
  return data;
};

export const exportChallenges = () => {
  const filePath = path.resolve(__dirname, challengesPath);
  const fileContent = readFileSync(filePath, "utf8");
  const challenges = yaml.parse(fileContent) || [];

  challenges.forEach((challenge: any) => {
    challenge.createdAt = challenge.createdAt || new Date().getTime();
    challenge.updatedAt = challenge.updatedAt || new Date().getTime();
  });

  const queries = [CreateTableChallengesQuery];

  challenges.forEach((challenge: any) => {
    queries.push(generateInsertQuery(challenge));
  });

  return queries;
};

export const createAndSaveChallenge = (challenge: any) => {
  challenge = {
    ...challenge,
    id: uuidv4(),
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    serializerPython: serializeFnPython,
    deSerializerPython: deserializeFnPython,
    mockFunction: mockFunction,
    preCodeForRawExecutionPython: preCodeForRawExecutionPython,
    serializerJavaScript: serializeFnJs,
    deSerializerJavaScript: deserializeFnJs,
    types: true,
  };

  // parse if the inputs have types in them
  if (challenge.testInput) {
    challenge.testInput.split("\n").forEach((input: string, index: number) => {
      let type = "string";
      try {
        type = challenge.inputTypes[index];
      } catch (e) {}

      if (!type) {
        challenge.types = false;
      }
    });
  }

  if (challenge.types) {
    challenge.serializerJava = serializeFnJava;
    challenge.deSerializerJava = deserializeFnJava;
    challenge.serializerC = serializeFnC;
    challenge.deSerializerC = deserializeFnC;
    challenge.deSerializerCpp = deserializeFnCpp;
    challenge.serializerCpp = serializeFnCpp;
  }

  const fileContent = readFileSync(
    path.resolve(__dirname, challengesPath),
    "utf8"
  );

  let data = yaml.parse(fileContent) || [];
  data.push(challenge);

  const yamlStr = yaml.stringify(data);
  writeFileSync(path.resolve(__dirname, challengesPath), yamlStr, "utf8");

  return new Promise((resolve) => resolve(challenge));
};

export const updateAndSaveChallenge = (challenge: any) => {
  challenge = {
    ...challenge,
    serializerPython: serializeFnPython,
    deSerializerPython: deserializeFnPython,
    mockFunction: mockFunction,
    preCodeForRawExecutionPython: preCodeForRawExecutionPython,
    serializerJavaScript: serializeFnJs,
    deSerializerJavaScript: deserializeFnJs,
    types: true,
    updatedAt: new Date().getTime(),
  };
  // parse if the inputs have types in them
  if (challenge.testInput) {
    challenge.testInput.split("\n").forEach((input: string, index: number) => {
      let type = "string";
      try {
        type = challenge.inputTypes[index];
      } catch (e) {}

      if (!type) {
        challenge.types = false;
      }
    });
  }

  if (challenge.types) {
    challenge.serializerJava = serializeFnJava;
    challenge.deSerializerJava = deserializeFnJava;
    challenge.serializerC = serializeFnC;
    challenge.deSerializerC = deserializeFnC;
    challenge.deSerializerCpp = deserializeFnCpp;
    challenge.serializerCpp = serializeFnCpp;
  }

  let fileContent = readFileSync(
    path.resolve(__dirname, challengesPath),
    "utf8"
  );
  return new Promise((resolve) => {
    let data = yaml.parse(fileContent) || [];
    let i = 0;
    for (; i < data.length; i++) {
      if (data[i].id === challenge.id) {
        data[i] = challenge;
        break;
      }
    }
    if (i >= data.length) {
      challenge.createdAt = new Date().getTime();
      challenge.updatedAt = new Date().getTime();
      data.push(challenge);
    }

    const yamlStr = yaml.stringify(data);
    writeFileSync(path.resolve(__dirname, challengesPath), yamlStr, "utf8");
    resolve(challenge);
  });
};

export const submitChallenge = async (parentChallenge: any) => {
  parentChallenge.id = uuidv4();
  let { result, challenge } = await runCode(parentChallenge, 0);
  const { compilationSuccess, testPass = false, actualOutput, error } = result;

  if (!challenge.keywordCheck) {
    challenge.keywordCheck = [];
  }

  challenge = {
    ...challenge,
    compilationSuccess,
    testPass,
    actualOutput: actualOutput || null,
    error: error || null,
  };

  const {
    hiddenTestInput1,
    hiddenTestOutput1,
    hiddenTestInput2,
    hiddenTestOutput2,
    hiddenTestInput3,
    hiddenTestOutput3,
  } = challenge.challengeInfo;

  if (challenge.compilationSuccess && (hiddenTestInput1 || hiddenTestOutput1)) {
    let response = await runCode(challenge, 1);
    let result1 = response.result;
    challenge = response.challenge;
    const { testPass, actualOutput, error } = result1;
    challenge = {
      ...challenge,
      hiddenTestPass1: testPass,
      hiddenTestActualOutput1: actualOutput || null,
      hiddenTestError1: error || null,
    };
  }

  if (challenge.compilationSuccess && (hiddenTestInput2 || hiddenTestOutput2)) {
    let response = await runCode(challenge, 2);
    let result2 = response.result;
    challenge = response.challenge;
    const { testPass, actualOutput, error } = result2;
    challenge = {
      ...challenge,
      hiddenTestPass2: testPass,
      hiddenTestActualOutput2: actualOutput || null,
      hiddenTestError2: error || null,
    };
  }

  if (challenge.compilationSuccess && (hiddenTestInput3 || hiddenTestOutput3)) {
    let response = await runCode(challenge, 3);
    let result3 = response.result;
    challenge = response.challenge;
    const { testPass, actualOutput, error } = result3;
    challenge = {
      ...challenge,
      hiddenTestPass3: testPass,
      hiddenTestActualOutput3: actualOutput || null,
      hiddenTestError3: error || null,
    };
  }
  const { challengeInfo } = challenge;
  if (
    challenge.compilationSuccess &&
    challenge.testPass &&
    challengeInfo.runTests &&
    ((challengeInfo.testCasesPython &&
      challengeInfo.testCasesPython.length !== 0) ||
      (challengeInfo.testCasesJava &&
        challengeInfo.testCasesJava.length !== 0) ||
      (challengeInfo.testCasesC && challengeInfo.testCasesC.length !== 0) ||
      (challengeInfo.testCasesCpp && challengeInfo.testCasesCpp.length !== 0))
  ) {
    try {
      challenge.originalRunner = challenge.runner;
      let response = await runTest(challenge);
      let testResult = response.testResult;
      challenge = response.challenge;
      const {
        testCasesPassPython = false,
        testCasesPassJava = false,
        testCasesPassC = false,
        testCasesPassCpp = false,
        testError,
        testOutput,
      } = testResult;
      challenge = {
        ...challenge,
        testCasesPassPython,
        testCasesPassJava,
        testCasesPassC,
        testCasesPassCpp,
        testError,
        testOutput,
      };
    } catch (e) {
      const err = e as Error;

      challenge = {
        ...challenge,
        testCasesPassPython: false,
        testCasesPassJava: false,
        testCasesPassC: false,
        testError: err.message || "Internal server error",
        testOutput: "Something went wrong !!",
      };
    }
  }

  appendToPlayedChallenges(challenge);
  return challenge;
};

type COMPILER_LANGUAGE = "c" | "cpp" | "python" | "javascript" | "java" | "";

export const importChallenges = async (
  challenges: any[],
  language: COMPILER_LANGUAGE
) => {
  for (let index = 0; index < challenges.length; index++) {
    let challenge = challenges[index];
    switch (language) {
      case "c":
        challenge.codeOutlineC = challenge.codeOutline;
        challenge.keywordCheckC = challenge.keywordCheck;
        challenge.testCasesC =
          challenge.testCases !== "undefined" ? null : challenge.testCases;
        break;
      case "cpp":
        challenge.codeOutlineCpp = challenge.codeOutline;
        challenge.keywordCheckCpp = challenge.keywordCheck;
        challenge.testCasesCpp =
          challenge.testCases !== "undefined" ? null : challenge.testCases;
        break;
      case "java":
        challenge.codeOutlineJava = challenge.codeOutline;
        challenge.keywordCheckJava = challenge.keywordCheck;
        challenge.testCasesJava =
          challenge.testCases !== "undefined" ? null : challenge.testCases;

        break;
      case "javascript":
        challenge.codeOutlineJavaScript = challenge.codeOutline;
        challenge.keywordCheckJavaScript = challenge.keywordCheck;
        challenge.testCasesJavaScript =
          challenge.testCases !== "undefined" ? null : challenge.testCases;
        break;
      case "python":
        challenge.codeOutlinePython = challenge.codeOutline;
        challenge.keywordCheckPython = challenge.keywordCheck;
        challenge.testCasesPython =
          challenge.testCases !== "undefined" ? null : challenge.testCases;
        break;
      default:
        break;
    }
    delete challenge.keywordCheck;
    delete challenge.codeOutline;
    delete challenge.testCases;

    if (challenge.id) {
      try {
        challenge = await updateAndSaveChallenge(challenge);
      } catch (e) {}
    } else {
      try {
        challenge = await createAndSaveChallenge(challenge);
      } catch (e) {}
    }
    challenges[index] = challenge;
  }
};
