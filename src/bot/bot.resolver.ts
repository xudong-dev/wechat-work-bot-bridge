import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AuthGuard } from "../auth/auth.guard";
import { Bot } from "./bot.entity";
import { CreateBotInput } from "./dtos/create-bot-input.dto";
import { UpdateBotInput } from "./dtos/update-bot-input.dto";

@UseGuards(AuthGuard)
@Resolver(() => Bot)
export class BotResolver {
  public constructor() {
    return this;
  }

  @Query(() => Bot)
  public async bot(
    @Args({
      name: "id",
      type: () => ID
    })
    id: string
  ): Promise<Bot> {
    return Bot.findOne({ where: { id }, relations: ["webhooks"] });
  }

  @Query(() => [Bot])
  public async bots(): Promise<Bot[]> {
    return Bot.find({ relations: ["webhooks"] });
  }

  @Mutation(() => Bot)
  public async createBot(@Args("input") input: CreateBotInput): Promise<Bot> {
    const bot = await Bot.create(input).save();
    bot.webhooks = [];
    return bot;
  }

  @Mutation(() => Bot)
  public async updateBot(
    @Args({
      name: "id",
      type: () => ID
    })
    id: string,
    @Args("input") input: UpdateBotInput
  ): Promise<Bot> {
    const bot = await Bot.findOne({ where: { id }, relations: ["webhooks"] });

    Object.keys(input).forEach(key => {
      bot[key] = input[key];
    });

    return bot.save();
  }

  @Mutation(() => Bot)
  public async removeBot(
    @Args({
      name: "id",
      type: () => ID
    })
    id: string
  ): Promise<Bot> {
    const bot = await Bot.findOne({ where: { id }, relations: ["webhooks"] });
    await bot.remove();
    bot.id = id;
    return bot;
  }
}
