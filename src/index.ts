import express from "express";
import ivm from "isolated-vm";

const app = express();
const port = 3030;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Node.js!");
});

// app.post("/run", (req, res) => {
//   const { code } = req.body;

//   if (!code) {
//     return res.status(400).send({ error: "No code provided" });
//   }
//   // let outputStr = "";
//   const isolate = new ivm.Isolate({ memoryLimit: 8 /* MB */ });
//   const script = isolate.compileScriptSync(code);
//   const context = isolate.createContextSync();

//   try {
//     script.runSync(context);

//     const result = script.release();

//     res.send({ result });
//   } catch (err) {
//     const error = err as Error;
//     res.status(500).send({ error: error.message });
//   }
// });

app.post("/run", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).send({ error: "No code provided" });
  }

  const isolate = new ivm.Isolate({ memoryLimit: 8 }); // 8 MB memory limit
  const context = await isolate.createContext();
  const jail = context.global;
  await jail.set("global", jail.derefInto());

  let logs: string[] = [];
  await jail.set("log", function (...args: any) {
    logs.push(args.join(" "));
  });

  try {
    const script = await isolate.compileScript(`
      global.result = (
        ${code}
      )();
    `);

    await script.run(context);
    const result = await jail.get("result");

    res.send({ result: result });
  } catch (err) {
    res.status(500).send({ error: (err as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
