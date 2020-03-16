import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { In } from "typeorm";

import { AuthGuard } from "../auth/auth.guard";
import { Bot } from "../bot/bot.entity";
import { CreateScheduleInput } from "./dtos/create-schedule-input.dto";
import { UpdateScheduleInput } from "./dtos/update-schedule-input.dto";
import { Schedule } from "./schedule.entity";
import { ScheduleService } from "./schedule.service";

@UseGuards(AuthGuard)
@Resolver(() => Schedule)
export class ScheduleResolver {
  public constructor(private readonly scheduleService: ScheduleService) {
    return this;
  }

  @Query(() => Schedule)
  public async schedule(
    @Args({
      name: "id",
      type: () => ID
    })
    id: string
  ): Promise<Schedule> {
    return Schedule.findOne({ where: { id }, relations: ["bots"] });
  }

  @Query(() => [Schedule])
  public async schedules(): Promise<Schedule[]> {
    return Schedule.find({ relations: ["bots"] });
  }

  @Mutation(() => Schedule)
  public async createSchedule(
    @Args("input") input: CreateScheduleInput
  ): Promise<Schedule> {
    const schedule = Schedule.create(input);
    schedule.bots = [];
    await schedule.save();

    if (schedule.enable) {
      await this.scheduleService.start(schedule);
    }

    return schedule;
  }

  @Mutation(() => Schedule)
  public async updateSchedule(
    @Args({
      name: "id",
      type: () => ID
    })
    id: string,
    @Args("input") input: UpdateScheduleInput
  ): Promise<Schedule> {
    const schedule = await Schedule.findOne({
      where: { id },
      relations: ["bots"]
    });

    Object.keys(input).forEach(key => {
      schedule[key] = input[key];
    });

    await schedule.save();

    if (schedule.enable) {
      await this.scheduleService.restart(schedule);
    } else {
      await this.scheduleService.stop(schedule);
    }

    return schedule;
  }

  @Mutation(() => Schedule)
  public async removeSchedule(
    @Args({
      name: "id",
      type: () => ID
    })
    id: string
  ): Promise<Schedule> {
    const schedule = await Schedule.findOne({
      where: { id },
      relations: ["bots"]
    });
    await schedule.remove();
    schedule.id = id;
    return schedule;
  }

  @Mutation(() => Schedule)
  public async setScheduleBots(
    @Args({
      name: "id",
      type: () => ID
    })
    id: string,
    @Args({
      name: "botIds",
      type: () => [ID]
    })
    botIds: string[]
  ): Promise<Schedule> {
    const schedule = await Schedule.findOne({
      where: { id },
      relations: ["bots"]
    });

    schedule.bots =
      botIds.length > 0 ? await Bot.find({ where: { id: In(botIds) } }) : [];
    return schedule.save();
  }
}
