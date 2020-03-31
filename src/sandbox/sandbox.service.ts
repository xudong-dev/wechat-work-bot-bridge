/* eslint-disable @typescript-eslint/no-explicit-any */
import { fork } from "child_process";

const { SANDBOX_TIMEOUT } = process.env;

export class SandboxService {
  public async run(
    code: string,
    args: any[] = []
  ): Promise<{
    value?: any;
    logs: string;
  }> {
    return new Promise((resolve, reject) => {
      let logs = "";

      const child = fork(require.resolve("./sandbox.process"), [], {
        stdio: "pipe",
      });

      child.on("error", reject);

      try {
        child.stdout.setEncoding("utf8");
        child.stderr.setEncoding("utf8");

        child.stdout.on("data", (data): void => {
          logs += data;
        });

        child.stderr.on("data", (data): void => {
          logs += data;
        });

        const watcher = setTimeout(
          () => child.kill(),
          Number(SANDBOX_TIMEOUT || 30000)
        );

        child.on("close", () => {
          clearTimeout(watcher);
          resolve({ logs });
        });

        child.on("message", (value) => {
          clearTimeout(watcher);
          resolve({ value, logs });
        });

        child.send({ code, args });
      } catch (err) {
        child.kill();
        throw err;
      }
    });
  }
}
