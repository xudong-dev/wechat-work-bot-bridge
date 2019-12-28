/* eslint-disable @typescript-eslint/no-explicit-any */
import { fork } from "child_process";

interface SandboxResult {
  value?: any;
  logs: string;
}

export class SandboxService {
  public async run(code: string, args: any[] = []): Promise<SandboxResult> {
    const result: SandboxResult = await new Promise((resolve, reject) => {
      let logs = "";
      const child = fork(require.resolve("../executor"), [], {
        stdio: "pipe"
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
          Number(process.env.RUN_TIMEOUT || 60 * 1000)
        );

        child.on("close", () => {
          clearTimeout(watcher);
          resolve({ logs });
        });

        child.on("message", value => {
          clearTimeout(watcher);
          resolve({ value, logs });
        });

        child.send({ code, args });
      } catch (err) {
        child.kill();
        throw err;
      }
    });

    return result;
  }
}
