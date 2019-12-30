import "dotenv/config";
import "source-map-support/register";

import { Logger, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import axios from "axios";
import axiosRetry from "axios-retry";
import { Job } from "bull";
import { LoggerModule, PinoLogger } from "nestjs-pino";

import { SandboxModule } from "../sandbox/sandbox.module";
import { SandboxService } from "../sandbox/sandbox.service";
import { Schedule } from "./schedule.entity";

const fetch = axios.create({ timeout: 10000 });
axiosRetry(fetch);

@Module({
  imports: [LoggerModule.forRoot(), TypeOrmModule.forRoot(), SandboxModule]
})
class ProcessorModule {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
let processor = async (job: Job<Schedule["id"]>): Promise<void> => {};

(async (): Promise<void> => {
  const app = await NestFactory.create(ProcessorModule, { logger: false });

  app.useLogger(app.get(Logger));

  const logger = await app.resolve(PinoLogger);
  const sandboxService = app.get(SandboxService);

  logger.info("schedule processor start");

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
              await fetch.post(bot.webhookUrl, value);
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
})();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (job: Job<Schedule["id"]>): Promise<any> => processor(job);
