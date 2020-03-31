import { Injectable } from "@nestjs/common";
import { QueueScheduler } from "bullmq";
import { PinoLogger } from "nestjs-pino";

const { REDIS_URL } = process.env;

const { hostname, port, password } = new URL(REDIS_URL);
const connection = {
  host: hostname,
  port: Number(port),
  password,
};

@Injectable()
export class ScheduleQueueScheduler extends QueueScheduler {
  constructor(private readonly logger: PinoLogger) {
    super("schedule", { connection });

    this.on("failed", (jobId: string, err: Error) => {
      this.logger.error({ jobId, err }, "queue scheduler failed");
    });

    this.on("stalled", (jobId: string, err: Error) => {
      this.logger.error({ jobId, err }, "queue scheduler stalled");
    });
  }
}
