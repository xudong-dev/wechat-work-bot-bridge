import { Injectable } from "@nestjs/common";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import os from "os";

const { REDIS_URL, WEB_CONCURRENCY } = process.env;

@Injectable()
export class ScheduleWorker extends Worker {
  public constructor() {
    super("schedule", require.resolve("./schedule.worker-processor"), {
      concurrency: Number(WEB_CONCURRENCY || os.cpus().length),
      connection: new IORedis(REDIS_URL)
    });

    this.on("completed", job => job.remove());
    this.on("failed", job => job.remove());
  }
}
