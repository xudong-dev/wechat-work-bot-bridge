import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import _ from "lodash";

import { Schedule } from "./schedule.entity";
import { ScheduleQueue } from "./schedule.queue";

@Injectable()
export class ScheduleService implements OnApplicationBootstrap {
  public constructor(private readonly scheduleQueue: ScheduleQueue) {
    return this;
  }

  public async onApplicationBootstrap(): Promise<void> {
    const schedules = await Schedule.find({ where: { enable: true } });

    // 启动时检查清除无效的可重复的任务
    await Promise.all(
      (await this.scheduleQueue.getRepeatableJobs())
        .filter(({ name, cron }) => !_.find(schedules, { id: name, cron }))
        .map(({ key }) => this.scheduleQueue.removeRepeatableByKey(key))
    );

    await Promise.all(schedules.map(schedule => this.start(schedule)));
  }

  public async start(schedule: Schedule): Promise<void> {
    await this.scheduleQueue.add(schedule.id, schedule.id, {
      repeat: { cron: schedule.cron }
    });
  }

  public async stop(schedule: Schedule): Promise<void> {
    await Promise.all(
      (await this.scheduleQueue.getRepeatableJobs())
        .filter(info => info.id === schedule.id)
        .map(info => this.scheduleQueue.removeRepeatableByKey(info.key))
    );
  }

  public async restart(schedule: Schedule): Promise<void> {
    await this.stop(schedule);
    await this.start(schedule);
  }
}
