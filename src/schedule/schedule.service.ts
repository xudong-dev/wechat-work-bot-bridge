import { InjectQueue } from "@nestjs/bull";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Queue } from "bull";
import _ from "lodash";
import { PinoLogger } from "nestjs-pino";

import { Schedule } from "./schedule.entity";

@Injectable()
export class ScheduleService implements OnApplicationBootstrap {
  public constructor(
    @InjectQueue("schedule")
    private readonly scheduleQueue: Queue<Schedule["id"]>,
    private readonly logger: PinoLogger
  ) {
    return this;
  }

  public async onApplicationBootstrap(): Promise<void> {
    this.scheduleQueue.on("completed", job => job.remove());
    this.scheduleQueue.on("failed", job => job.remove());

    const schedules = await Schedule.find({ where: { enable: true } });

    // 启动时检查清除无效的可重复的任务
    await Promise.all(
      (await this.scheduleQueue.getRepeatableJobs())
        .filter(({ id, cron }) => !_.find(schedules, { id, cron }))
        .map(({ id, key }) => {
          this.logger.info({ id, key }, "remove repeatable");
          return this.scheduleQueue.removeRepeatableByKey(key);
        })
    );

    await Promise.all(schedules.map(schedule => this.start(schedule)));
  }

  public async start(schedule: Schedule, log = true): Promise<void> {
    if (log) {
      this.logger.info(
        { id: schedule.id, cron: schedule.cron },
        "schedule start"
      );
    }

    await this.scheduleQueue.add("schedule", schedule.id, {
      jobId: schedule.id,
      repeat: { cron: schedule.cron }
    });
  }

  public async stop(schedule: Schedule, log = true): Promise<void> {
    if (log) {
      this.logger.info(
        { id: schedule.id, cron: schedule.cron },
        "schedule stop"
      );
    }

    await Promise.all(
      (await this.scheduleQueue.getRepeatableJobs())
        .filter(({ id }) => id === schedule.id)
        .map(({ id, key }) => {
          this.logger.info({ id, key }, "remove repeatable");
          return this.scheduleQueue.removeRepeatableByKey(key);
        })
    );
  }

  public async restart(schedule: Schedule): Promise<void> {
    this.logger.info(
      { id: schedule.id, cron: schedule.cron },
      "schedule restart"
    );

    await this.stop(schedule, false);
    await this.start(schedule, false);
  }
}
