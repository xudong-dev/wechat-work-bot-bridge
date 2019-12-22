/* eslint-disable class-methods-use-this */

import axios from "axios";
import { Job } from "bull";
import { Process, Processor } from "nest-bull";

import { SandboxService } from "../sandbox/sandbox.service";
import { Schedule } from "./schedule.entity";

@Processor({ name: "schedule" })
export class ScheduleQueue {
  public constructor(private readonly sandboxService: SandboxService) {
    return this;
  }

  @Process({ name: "schedule" })
  public async process(job: Job<Schedule["id"]>): Promise<void> {
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
  }
}
