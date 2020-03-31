import { Module } from "@nestjs/common";

import { SandboxModule } from "../sandbox/sandbox.module";
import { ScheduleQueue } from "./schedule.queue";
import { ScheduleQueueScheduler } from "./schedule.queue-scheduler";
import { ScheduleResolver } from "./schedule.resolver";
import { ScheduleService } from "./schedule.service";
import { ScheduleWorker } from "./schedule.worker";

@Module({
  imports: [SandboxModule],
  providers: [
    ScheduleQueue,
    ScheduleQueueScheduler,
    ScheduleResolver,
    ScheduleService,
    ScheduleWorker,
  ],
})
export class ScheduleModule {}
