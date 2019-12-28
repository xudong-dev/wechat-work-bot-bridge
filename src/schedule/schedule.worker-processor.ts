import "dotenv/config";
import "source-map-support/register";

import { Logger, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import axios from "axios";
import { Job } from "bullmq";
import { LoggerModule, PinoLogger } from "nestjs-pino";

import { SandboxModule } from "../sandbox/sandbox.module";
import { SandboxService } from "../sandbox/sandbox.service";
import { Schedule } from "./schedule.entity";

@Module({
  imports: [LoggerModule.forRoot(), TypeOrmModule.forRoot(), SandboxModule]
})
class ProcessorModule {}

export default async (job: Job): Promise<void> => {
  const app = await NestFactory.create(ProcessorModule, { logger: false });

  app.useLogger(app.get(Logger));

  const logger = await app.resolve(PinoLogger);
  const sandboxService = app.get(SandboxService);

  logger.info({ id: job.data }, "call schedule");

  const schedule = await Schedule.findOne({
    where: { id: job.data },
    relations: ["bots"]
  });

  const { value } = await sandboxService.run(schedule.code);

  // eslint-disable-next-line no-restricted-syntax
  for (const bot of schedule.bots) {
    // eslint-disable-next-line no-await-in-loop
    await axios.post(bot.webhookUrl, value);
  }
};
