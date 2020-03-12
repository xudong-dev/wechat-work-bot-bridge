/* eslint-disable */
import "dotenv/config";
import "source-map-support/register";
/* eslint-enable */

import { Logger, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LoggerModule } from "nestjs-pino";

import { ScheduleWorker } from "./schedule/schedule.worker";
import { SandboxModule } from "./sandbox/sandbox.module";

@Module({
  imports: [LoggerModule.forRoot(), TypeOrmModule.forRoot(), SandboxModule],
  providers: [ScheduleWorker]
})
class WorkerModule {}

(async (): Promise<void> => {
  const app = await NestFactory.create(WorkerModule, {
    ...(process.env.NODE_ENV === "production" ? { logger: false } : {})
  });

  app.useLogger(app.get(Logger));
})();
