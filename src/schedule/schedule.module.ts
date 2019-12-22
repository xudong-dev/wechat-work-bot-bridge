import { Module } from "@nestjs/common";
import { BullModule } from "nest-bull";
import url from "url";

import { SandboxModule } from "../sandbox/sandbox.module";
import { ScheduleQueue } from "./schedule.queue";
import { ScheduleResolver } from "./schedule.resolver";
import { ScheduleService } from "./schedule.service";

const { REDIS_URL } = process.env;

@Module({
  imports: [
    BullModule.register({
      name: "schedule",
      options: {
        redis: {
          ...(url.parse(REDIS_URL).auth
            ? { password: url.parse(REDIS_URL).auth.split(":")[1] }
            : {}),
          host: url.parse(REDIS_URL).hostname,
          port: Number(url.parse(REDIS_URL).port)
        }
      }
    }),
    SandboxModule
  ],
  providers: [ScheduleResolver, ScheduleQueue, ScheduleService]
})
export class ScheduleModule {}
