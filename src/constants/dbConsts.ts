import { removeQuotes } from "../utils/helpers";

export const CreateTableChallengesQuery = `
create table Challenges
    (
       Id varchar(36)
          primary key,
       IsActive bit not null,
       CreatedAt datetime(6) not null,
       UpdatedAt datetime(6) not null,
       Title longtext null,
       ProblemStatement longtext null,
       ChallengeDifficulty int not null, # 0:easy, 1:medium, 2:hard, 3:expert
       CodeOutlinePython longtext null,
       CodeOutlineJavaScript longtext null,
       CodeOutlineJava longtext null,
       CodeOutlineC longtext null,
       CodeOutlineCpp longtext null,
       RawCode bit not null,
       PreCodeForRawExecutionPython longtext null,
       SerializerPython longtext null,
       DeSerializerPython longtext null,
       SerializerJavaScript longtext null,
       DeSerializerJavaScript longtext null,
       SerializerJava longtext null,
       DeSerializerJava longtext null,
       SerializerC longtext null,
       DeSerializerC longtext null,
       SerializerCpp longtext null,
       DeSerializerCpp longtext null,
       KeywordCheckPython longtext null,
       KeywordCheckJavaScript longtext null,
       KeywordCheckJava longtext null,
       KeywordCheckC longtext null,
       KeywordCheckCpp longtext null,
       FunctionName text null,
       TestInput longtext null,
       TestOutput longtext null,
       HiddenTestInput1 longtext null,
       HiddenTestOutput1 longtext null,
       HiddenTestInput2 longtext null,
       HiddenTestOutput2 longtext null,
       HiddenTestInput3 longtext null,
       HiddenTestOutput3 longtext null,
       TestCasesPython longtext null,
       TestCasesJavaScript longtext null,
       TestCasesJava longtext null,
       TestCasesC longtext null,
       TestCasesCpp longtext null
       );
`;

const formatDate = (timestamp: number) => `from_unixtime(${timestamp / 1000})`;

export const generateInsertQuery = (challenge: any) => `
INSERT INTO Challenges (
  Id, IsActive, CreatedAt, UpdatedAt, Title, ProblemStatement,
  ChallengeDifficulty, CodeOutlinePython, CodeOutlineJavaScript,
  CodeOutlineJava, CodeOutlineC, CodeOutlineCpp, RawCode,
  PreCodeForRawExecutionPython, SerializerPython, DeSerializerPython,
  SerializerJavaScript, DeSerializerJavaScript, SerializerJava,
  DeSerializerJava, SerializerC, DeSerializerC, SerializerCpp,
  DeSerializerCpp, KeywordCheckPython, KeywordCheckJavaScript,
  KeywordCheckJava, KeywordCheckC, KeywordCheckCpp, FunctionName,
  TestInput, TestOutput, HiddenTestInput1, HiddenTestOutput1,
  HiddenTestInput2, HiddenTestOutput2, HiddenTestInput3, HiddenTestOutput3,
  TestCasesPython, TestCasesJavaScript, TestCasesJava, TestCasesC, TestCasesCpp
) VALUES (
  "${challenge.id}", ${challenge.isActive === false ? 0 : 1}, ${formatDate(
  challenge.createdAt
)},
  ${formatDate(challenge.updatedAt)}, "${removeQuotes(challenge.title)}",
  "${removeQuotes(challenge.problemStatement)}", ${
  challenge.challengeDifficulty
},
  "${removeQuotes(challenge.codeOutlinePython)}", "${removeQuotes(
  challenge.codeOutlineJavaScript
)}",
  "${removeQuotes(challenge.codeOutlineJava)}", "${removeQuotes(
  challenge.codeOutlineC
)}",
  "${removeQuotes(challenge.codeOutlineCpp)}", ${challenge.isRaw ? 1 : 0},
  "${removeQuotes(challenge.preCodeForRawExecutionPython)}", "${removeQuotes(
  challenge.serializerPython
)}",
  "${removeQuotes(challenge.deSerializerPython)}", "${removeQuotes(
  challenge.serializerJavaScript
)}",
  "${removeQuotes(challenge.deSerializerJavaScript)}", "${removeQuotes(
  challenge.serializerJava
)}",
  "${removeQuotes(challenge.deSerializerJava)}", "${removeQuotes(
  challenge.serializerC
)}",
  "${removeQuotes(challenge.deSerializerC)}", "${removeQuotes(
  challenge.serializerCpp
)}",
  "${removeQuotes(challenge.deSerializerCpp)}", "${removeQuotes(
  challenge.keywordCheckPython
)}",
  "${removeQuotes(challenge.keywordCheckJavaScript)}", "${removeQuotes(
  challenge.keywordCheckJava
)}",
  "${removeQuotes(challenge.keywordCheckC)}", "${removeQuotes(
  challenge.keywordCheckCpp
)}",
  "${removeQuotes(challenge.functionName)}", "${removeQuotes(
  challenge.testInput
)}",
  "${removeQuotes(challenge.testOutput)}", "${removeQuotes(
  challenge.hiddenTestInput1
)}",
  "${removeQuotes(challenge.hiddenTestOutput1)}", "${removeQuotes(
  challenge.hiddenTestInput2
)}",
  "${removeQuotes(challenge.hiddenTestOutput2)}", "${removeQuotes(
  challenge.hiddenTestInput3
)}",
  "${removeQuotes(challenge.hiddenTestOutput3)}", "${removeQuotes(
  JSON.stringify(challenge.testCasesPython)
)}",
  "${removeQuotes(
    JSON.stringify(challenge.testCasesJavaScript)
  )}", "${removeQuotes(JSON.stringify(challenge.testCasesJava))}",
  "${removeQuotes(JSON.stringify(challenge.testCasesC))}", "${removeQuotes(
  JSON.stringify(challenge.testCasesCpp)
)}"
);`;
