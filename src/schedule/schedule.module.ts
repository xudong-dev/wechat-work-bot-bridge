import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { ScheduleResolver } from "./schedule.resolver";
import { ScheduleService } from "./schedule.service";

const { REDIS_URL } = process.env;

@Module({
  imports: [
    BullModule.registerQueue({
      name: "schedule",
      redis: REDIS_URL,
      processors: [
        {
          concurrency: 50,
          name: "schedule",
          path: require.resolve("./schedule.processor")
        }
      ]
    })
  ],
  providers: [ScheduleResolver, ScheduleService]
})
export class ScheduleModule {}
