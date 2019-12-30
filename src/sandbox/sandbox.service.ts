import { NodeVM } from "vm2";

export class SandboxService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async run(code: string, args: any[] = []): Promise<any> {
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

    return vm(...args);
  }
}
