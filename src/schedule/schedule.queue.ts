import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import IORedis from "ioredis";

const { REDIS_URL } = process.env;

@Injectable()
export class ScheduleQueue extends Queue {
  public constructor() {
    super("schedule", { connection: new IORedis(REDIS_URL) });
  }
}
