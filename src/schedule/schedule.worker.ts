import { Injectable } from "@nestjs/common";
import axios from "axios";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { PinoLogger } from "nestjs-pino";

import { SandboxService } from "../sandbox/sandbox.service";
import { Schedule } from "./schedule.entity";

const { REDIS_URL } = process.env;

@Injectable()
export class ScheduleWorker extends Worker {
  public constructor(
    private readonly sandboxService: SandboxService,
    private readonly logger: PinoLogger
  ) {
    super(
      "schedule",
      async job => {
        this.logger.info({ id: job.data }, "call schedule");

        const schedule = await Schedule.findOne({
          where: { id: job.data },
          relations: ["bots"]
        });

        const { value } = await this.sandboxService.run(schedule.code);

        // eslint-disable-next-line no-restricted-syntax
        for (const bot of schedule.bots) {
          // eslint-disable-next-line no-await-in-loop
          await axios.post(bot.webhookUrl, value);
        }
      },
      { connection: new IORedis(REDIS_URL) }
    );

    this.on("completed", job => job.remove());
    this.on("failed", job => job.remove());
  }
}
