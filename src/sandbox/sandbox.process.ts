import { NodeVM } from "vm2";

process.on("uncaughtException", err => {
  process.stderr.write(err.toString());
  process.exit(1);
});

process.on("message", ({ code = "", args = [] }) => {
  const vm = new NodeVM({
    console: "inherit",
    require: {
      external: {
        modules: [
          "lodash",
          "moment",
          "moment-timezone",
          "numeral",
          "axios",
          "bcryptjs"
        ],
        transitive: true
      }
    }
  }).run(code, __filename);

  if (!(vm instanceof Function)) {
    throw new Error("module.exports is not a function.");
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  (async () => {
    try {
      process.send((await vm(...args)) || null);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }

    process.exit(0);
  })();
});