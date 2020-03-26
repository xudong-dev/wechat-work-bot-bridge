import { Injectable } from "@nestjs/common";
import { Worker } from "bullmq";

import { Schedule } from "./schedule.entity";

const { REDIS_URL } = process.env;

const { host, port, password } = new URL(REDIS_URL);
const connection = { host, port: Number(port), password };

@Injectable()
export class ScheduleWorker extends Worker<Schedule["id"]> {
  constructor() {
    super("schedule", require.resolve("./schedule.processor"), {
      connection,
      concurrency: 50
    });
  }
}
