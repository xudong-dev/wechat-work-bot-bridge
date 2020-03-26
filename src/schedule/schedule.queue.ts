import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

import { Schedule } from "./schedule.entity";

const { REDIS_URL } = process.env;

const { host, port, password } = new URL(REDIS_URL);
const connection = { host, port: Number(port), password };

@Injectable()
export class ScheduleQueue extends Queue<Schedule["id"]> {
  constructor() {
    super("schedule", { connection });
  }
}
