import { Injectable } from "@nestjs/common";
import { Worker } from "bullmq";
import Redis from "ioredis";

import { Schedule } from "./schedule.entity";

const { REDIS_URL } = process.env;

@Injectable()
export class ScheduleWorker extends Worker<Schedule["id"]> {
  constructor() {
    super("schedule", require.resolve("./schedule.processor"), {
      connection: new Redis(REDIS_URL),
      concurrency: 50
    });
  }
}
