import { Injectable } from "@nestjs/common";
import retry from "async-retry";
import axios from "axios";
import { Job, Worker } from "bullmq";
import Redis from "ioredis";
import { PinoLogger } from "nestjs-pino";

import { SandboxService } from "../sandbox/sandbox.service";
import { Schedule } from "./schedule.entity";

const { REDIS_URL } = process.env;

const fetch = axios.create({ timeout: 10000 });

@Injectable()
export class ScheduleWorker extends Worker<Schedule["id"]> {
  constructor(
    private readonly logger: PinoLogger,
    private readonly sandboxService: SandboxService
  ) {
    super("schedule", job => this.processor(job), {
      connection: new Redis(REDIS_URL),
      concurrency: 50
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async processor(job: Job<Schedule["id"]>): Promise<void> {
    this.logger.info({ id: job.data }, "call schedule");

    const schedule = await Schedule.findOne({
      where: { id: job.data },
      relations: ["bots"]
    });

    const { value } = await this.sandboxService.run(schedule.code);

    if (value) {
      await Promise.all(
        schedule.bots.map(bot =>
          (async (): Promise<void> => {
            try {
              await retry(
                async bail => {
                  try {
                    await fetch.post(bot.webhookUrl, value);
                  } catch (err) {
                    bail(err);
                  }
                },
                { retries: 5 }
              );
            } catch (err) {
              this.logger.error(
                { id: bot.id, webhookUrl: bot.webhookUrl },
                "call bot error"
              );
            }
          })()
        )
      );
    }
  }
}
