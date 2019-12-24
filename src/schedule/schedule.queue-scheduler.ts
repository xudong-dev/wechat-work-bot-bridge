import { Injectable } from "@nestjs/common";
import { QueueScheduler } from "bullmq";
import IORedis from "ioredis";

const { REDIS_URL } = process.env;

@Injectable()
export class ScheduleQueueScheduler extends QueueScheduler {
  public constructor() {
    super("schedule", { connection: new IORedis(REDIS_URL) });
  }
}
