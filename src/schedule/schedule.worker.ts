import { Injectable } from "@nestjs/common";
import axios from "axios";
import { Worker } from "bullmq";

import { SandboxService } from "../sandbox/sandbox.service";
import { Schedule } from "./schedule.entity";

@Injectable()
export class ScheduleWorker extends Worker {
  public constructor(private readonly sandboxService: SandboxService) {
    super("schedule", async job => {
      const schedule = await Schedule.findOne({
        where: { id: job.data },
        relations: ["bots"]
      });

      const { result, logs } = await this.sandboxService.run(schedule.code);

      console.log(`[${schedule.id}]`, result, logs);

      // eslint-disable-next-line no-restricted-syntax
      for (const bot of schedule.bots) {
        // eslint-disable-next-line no-await-in-loop
        await axios.post(bot.webhookUrl, result);
      }
    });

    this.on("completed", job => job.remove());
    this.on("failed", job => job.remove());
  }
}
