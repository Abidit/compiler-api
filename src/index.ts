import express from "express";
import { createWriteStream } from "fs";
import { join } from "path";
import archiver from "archiver";

import {
  createAndSaveChallenge,
  deleteChallenge,
  deletePlayerChallenge,
  emptyChallenges,
  emptyPlayerChallenges,
  exportChallenges,
  getAllChallenges,
  getPlayerChallenges,
  importChallenges,
  submitChallenge,
  updateAndSaveChallenge,
} from "./services/challengeServices";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Node.js!");
});

app.get("/challenges", (req, res) => {
  const challenges = getAllChallenges();
  res.json(challenges);
});

app.use("/db_dump", (req, res) => {
  const output = createWriteStream("/tmp/dump.zip");
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  archive.pipe(output);

  // false means put all the files in root folder of zip
  archive.directory(join(__dirname, "../db/"), false);
  archive.finalize();

  setTimeout(() => {
    return res.sendFile("/tmp/dump.zip");
  }, 500);
});

app.post("/challenges_import/python", async (req, res, next) => {
  const { challenges } = req.body;
  await importChallenges(challenges, "python");
  res.json({ challenges });
});

app.post("/challenges_import/javascript", async (req, res, next) => {
  const { challenges } = req.body;
  await importChallenges(challenges, "javascript");
  res.json({ challenges });
});

app.post("/challenges_import/java", async (req, res, next) => {
  const { challenges } = req.body;
  await importChallenges(challenges, "java");
  res.json({ challenges });
});

app.post("/challenges_import/c", async (req, res, next) => {
  const { challenges } = req.body;
  await importChallenges(challenges, "c");
  res.json({ challenges });
});

app.post("/challenges_import/cpp", async (req, res, next) => {
  const { challenges } = req.body;
  await importChallenges(challenges, "cpp");
  res.json({ challenges });
});

app.post("/challenges_import", async (req, res, next) => {
  const { challenges } = req.body;
  await importChallenges(challenges, "");
  res.json({ challenges });
});

app.post("/challenges", (req, res, next) => {
  const { challenge } = req.body;
  if (challenge.id) {
    updateAndSaveChallenge(challenge)
      .then((result) => {
        res.json(result);
      })
      .catch((e) => console.error(e));
  } else {
    createAndSaveChallenge(challenge)
      .then((result) => {
        res.json(result);
      })
      .catch((e) => console.error(e));
  }
});

app.delete("/challenges", (req, res, next) => {
  const { id } = req.body;
  deleteChallenge(id)
    .then((result) => {
      res.json(result);
    })
    .catch((e) => console.error(e));
});

app.post("/empty_challenges", (req, res, next) => {
  try {
    emptyChallenges();
    res.json([]);
  } catch (e) {
    console.error(e);
  }
});

app.post("/empty_player_challenges", (req, res, next) => {
  try {
    emptyPlayerChallenges();
    res.json([]);
  } catch (e) {
    console.error(e);
  }
});

app.delete("/player_challenges", (req, res, next) => {
  const { id } = req.body;
  deletePlayerChallenge(id)
    .then((result) => {
      res.json(result);
    })
    .catch((e) => console.error(e));
});

app.post("/player_challenges", (req, res, next) => {
  const { challenge } = req.body;
  submitChallenge(challenge)
    .then((result) => {
      res.json(result);
    })
    .catch((e) => console.error(e));
});

app.get("/player_challenges", (req, res, next) => {
  const history = getPlayerChallenges();
  res.json(history);
});

app.get("/export_challenges", (req, res, next) => {
  const queries = exportChallenges();
  res.json(queries);
});

app.get("/test", async (req, res, next) => {
  res.json({ status: "Deploy by Punit" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send("Not Found");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on ${process.env.PORT || 3000}`);
});
