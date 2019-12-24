import { Injectable } from "@nestjs/common";
import { QueueScheduler } from "bullmq";

@Injectable()
export class ScheduleQueueScheduler extends QueueScheduler {
  public constructor() {
    super("schedule");
  }
}
