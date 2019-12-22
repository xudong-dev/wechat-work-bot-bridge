import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ID } from "type-graphql";
import { In } from "typeorm";

import { AuthGuard } from "../auth/auth.guard";
import { Bot } from "../bot/bot.entity";
import { CreateWebhookInput } from "./dtos/create-webhook-input.dto";
import { UpdateWebhookInput } from "./dtos/update-webhook-input.dto";
import { Webhook } from "./webhook.entity";

@UseGuards(AuthGuard)
@Resolver(() => Webhook)
export class WebhookResolver {
  public constructor() {
    return this;
  }

  @Query(() => Webhook)
  public async webhook(
    @Args({
      name: "id",
      type: () => ID
    })
    id: string
  ): Promise<Webhook> {
    return Webhook.findOne({ where: { id }, relations: ["bots"] });
  }

  @Query(() => [Webhook])
  public async webhooks(): Promise<Webhook[]> {
    return Webhook.find({ relations: ["bots"] });
  }

  @Mutation(() => Webhook)
  public async createWebhook(
    @Args("input") input: CreateWebhookInput
  ): Promise<Webhook> {
    const webhook = await Webhook.create(input).save();
    webhook.bots = [];
    return webhook;
  }

  @Mutation(() => Webhook)
  public async updateWebhook(
    @Args({
      name: "id",
      type: () => ID
    })
    id: string,
    @Args("input") input: UpdateWebhookInput
  ): Promise<Webhook> {
    const webhook = await Webhook.findOne({
      where: { id },
      relations: ["bots"]
    });

    Object.keys(input).forEach(key => {
      webhook[key] = input[key];
    });

    return webhook.save();
  }

  @Mutation(() => Webhook)
  public async removeWebhook(
    @Args({
      name: "id",
      type: () => ID
    })
    id: string
  ): Promise<Webhook> {
    const webhook = await Webhook.findOne({
      where: { id },
      relations: ["bots"]
    });
    await webhook.remove();
    webhook.id = id;
    return webhook;
  }

  @Mutation(() => Webhook)
  public async setWebhookBots(
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
  ): Promise<Webhook> {
    const webhook = await Webhook.findOne({
      where: { id },
      relations: ["bots"]
    });

    webhook.bots =
      botIds.length > 0 ? await Bot.find({ where: { id: In(botIds) } }) : [];
    return webhook.save();
  }
}
