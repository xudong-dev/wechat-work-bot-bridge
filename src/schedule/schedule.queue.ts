import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import url from "url";

const { REDIS_URL } = process.env;

@Injectable()
export class ScheduleQueue extends Queue {
  public constructor() {
    super("schedule", {
      connection: {
        ...(url.parse(REDIS_URL).auth
          ? { password: url.parse(REDIS_URL).auth.split(":")[1] }
          : {}),
        host: url.parse(REDIS_URL).hostname,
        port: Number(url.parse(REDIS_URL).port)
      }
    });
  }
}
