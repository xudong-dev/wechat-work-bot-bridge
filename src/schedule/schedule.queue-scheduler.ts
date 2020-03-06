import { Injectable } from "@nestjs/common";
import { QueueScheduler } from "bullmq";
import Redis from "ioredis";

const { REDIS_URL } = process.env;

@Injectable()
export class ScheduleQueueScheduler extends QueueScheduler {
  constructor() {
    super("schedule", { connection: new Redis(REDIS_URL) });
  }
}
