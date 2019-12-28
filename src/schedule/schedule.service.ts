import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import _ from "lodash";
import { PinoLogger } from "nestjs-pino";

import { Schedule } from "./schedule.entity";
import { ScheduleQueue } from "./schedule.queue";

@Injectable()
export class ScheduleService implements OnApplicationBootstrap {
  public constructor(
    private readonly scheduleQueue: ScheduleQueue,
    private readonly logger: PinoLogger
  ) {
    return this;
  }

  public async onApplicationBootstrap(): Promise<void> {
    const schedules = await Schedule.find({ where: { enable: true } });

    // 启动时检查清除无效的可重复的任务
    await Promise.all(
      (await this.scheduleQueue.getRepeatableJobs())
        .filter(({ name, cron }) => !_.find(schedules, { id: name, cron }))
        .map(({ name, key }) => {
          this.logger.info({ name, key }, "remove repeatable");
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

    await this.scheduleQueue.add(schedule.id, schedule.id, {
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
        .filter(({ name }) => name === schedule.id)
        .map(info => this.scheduleQueue.removeRepeatableByKey(info.key))
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
