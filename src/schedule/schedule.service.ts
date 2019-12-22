import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Queue } from "bull";
import _ from "lodash";
import { InjectQueue } from "nest-bull";

import { Schedule } from "./schedule.entity";

@Injectable()
export class ScheduleService implements OnApplicationBootstrap {
  public constructor(
    @InjectQueue("schedule")
    private readonly scheduleQueue: Queue<Schedule["id"]>
  ) {
    return this;
  }

  public async onApplicationBootstrap(): Promise<void> {
    const schedules = await Schedule.find({ where: { enable: true } });

    // 启动时检查清除无效的可重复的任务
    await Promise.all(
      (await this.scheduleQueue.getRepeatableJobs())
        .filter(({ id, cron }) => !_.find(schedules, { id, cron }))
        .map(({ key }) => this.scheduleQueue.removeRepeatableByKey(key))
    );

    await Promise.all(
      schedules.map(schedule =>
        this.scheduleQueue.add("schedule", schedule.id, {
          jobId: schedule.id,
          repeat: { cron: schedule.cron }
        })
      )
    );
  }

  public async start(schedule: Schedule): Promise<void> {
    await this.scheduleQueue.add("schedule", schedule.id, {
      jobId: schedule.id,
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
