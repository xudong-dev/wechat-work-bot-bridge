import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import Redis from "ioredis";

import { Schedule } from "./schedule.entity";

const { REDIS_URL } = process.env;

@Injectable()
export class ScheduleQueue extends Queue<Schedule["id"]> {
  constructor() {
    super("schedule", { connection: new Redis(REDIS_URL) });
  }
}
