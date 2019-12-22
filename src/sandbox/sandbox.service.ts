import { fork } from "child_process";
import { join } from "path";

export class SandboxService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public run(code: string, context?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let logs = "";
      const child = fork(join(process.cwd(), "executor.js"), [], {
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
          Number(process.env.RUN_TIMEOUT || 10000)
        );

        child.on("close", () => {
          clearTimeout(watcher);
          resolve({ logs });
        });

        child.on("message", result => {
          clearTimeout(watcher);
          resolve({ result, logs });
        });

        child.send({ code, context });
      } catch (err) {
        child.kill();
        throw err;
      }
    });
  }
}
