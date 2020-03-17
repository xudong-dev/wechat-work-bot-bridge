import { Injectable } from "@nestjs/common";
import { QueueScheduler } from "bullmq";
import Redis from "ioredis";
import { PinoLogger } from "nestjs-pino";

const { REDIS_URL } = process.env;

@Injectable()
export class ScheduleQueueScheduler extends QueueScheduler {
  constructor(private readonly logger: PinoLogger) {
    super("schedule", {
      connection: new Redis(REDIS_URL),
      stalledInterval: 100,
      maxStalledCount: 0
    });

    this.on("failed", (jobId: string, err: Error) => {
      this.logger.error({ jobId, err }, "queue scheduler failed");
    });

    this.on("stalled", (jobId: string, err: Error) => {
      this.logger.error({ jobId, err }, "queue scheduler stalled");
    });
  }
}
