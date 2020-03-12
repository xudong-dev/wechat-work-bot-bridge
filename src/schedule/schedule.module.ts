import { Module } from "@nestjs/common";

import { ScheduleQueue } from "./schedule.queue";
import { ScheduleQueueScheduler } from "./schedule.queue-scheduler";
import { ScheduleResolver } from "./schedule.resolver";
import { ScheduleService } from "./schedule.service";

@Module({
  providers: [
    ScheduleQueue,
    ScheduleQueueScheduler,
    ScheduleResolver,
    ScheduleService
  ]
})
export class ScheduleModule {}
