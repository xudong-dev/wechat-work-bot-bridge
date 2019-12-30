import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import os from "os";

import { SandboxModule } from "../sandbox/sandbox.module";
import { ScheduleResolver } from "./schedule.resolver";
import { ScheduleService } from "./schedule.service";

const { REDIS_URL, WEB_CONCURRENCY } = process.env;

@Module({
  imports: [
    BullModule.registerQueue({
      name: "schedule",
      redis: REDIS_URL,
      processors: [
        {
          concurrency: Number(WEB_CONCURRENCY || os.cpus.length),
          name: "schedule",
          path: require.resolve("./schedule.processor")
        }
      ]
    }),
    SandboxModule
  ],
  providers: [ScheduleResolver, ScheduleService]
})
export class ScheduleModule {}
