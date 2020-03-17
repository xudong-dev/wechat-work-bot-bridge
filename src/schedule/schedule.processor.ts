/* eslint-disable */
import "dotenv/config";
import "source-map-support/register";
/* eslint-enable */

import { Logger, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import retry from "async-retry";
import axios from "axios";
import { Job, Processor } from "bullmq";

import { LoggerModule, PinoLogger } from "nestjs-pino";

import { SandboxModule } from "../sandbox/sandbox.module";
import { SandboxService } from "../sandbox/sandbox.service";
import { Schedule } from "./schedule.entity";

const fetch = axios.create({ timeout: 10000 });

let processor: Processor = function waitProcessor(job): Promise<void> {
  return new Promise(resolve => {
    const timer = setInterval(() => {
      if (processor !== waitProcessor) {
        resolve(processor(job));
        clearInterval(timer);
      }
    }, 1000);
  });
};

@Module({
  imports: [LoggerModule.forRoot(), TypeOrmModule.forRoot(), SandboxModule]
})
class ScheduleProcessorModule {}

(async (): Promise<void> => {
  const app = await NestFactory.create(ScheduleProcessorModule, {
    ...(process.env.NODE_ENV === "production" ? { logger: false } : {})
  });

  app.useLogger(app.get(Logger));

  const logger = await app.resolve(PinoLogger);
  const sandboxService = app.get(SandboxService);

  processor = async (job: Job<Schedule["id"]>): Promise<void> => {
    logger.info({ id: job.data }, "call schedule");

    const schedule = await Schedule.findOne({
      where: { id: job.data },
      relations: ["bots"]
    });

    const { value } = await sandboxService.run(schedule.code);

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
                { retries: 3 }
              );
            } catch (err) {
              logger.error(
                { id: bot.id, webhookUrl: bot.webhookUrl },
                "call bot error"
              );
            }
          })()
        )
      );
    }
  };

  logger.info("schedule processor started");
})();

export default (job: Job): Promise<void> => processor(job);
