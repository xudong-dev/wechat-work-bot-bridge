import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Query
} from "@nestjs/common";
import axios from "axios";
import { PinoLogger } from "nestjs-pino";

import { SandboxService } from "../sandbox/sandbox.service";
import { Webhook } from "./webhook.entity";

@Controller("webhooks")
export class WebhookController {
  public constructor(
    private readonly sandboxService: SandboxService,
    private readonly logger: PinoLogger
  ) {
    return this;
  }

  @HttpCode(200)
  @Get(":id/send")
  public async get(
    @Param("id") id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Headers() headers: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Query() query: any
  ): Promise<{ status: string }> {
    return this.post(id, headers, query);
  }

  @HttpCode(200)
  @Post(":id/send")
  public async post(
    @Param("id") id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Headers() headers: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Query() query: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Body() body?: any
  ): Promise<{ status: string }> {
    this.logger.info({ id }, "call webhook");

    const webhook = await Webhook.findOne({
      where: { id },
      relations: ["bots"]
    });

    const { value } = await this.sandboxService.run(webhook.code, [
      {
        headers,
        query,
        body
      }
    ]);

    // eslint-disable-next-line no-restricted-syntax
    for (const bot of webhook.bots) {
      // eslint-disable-next-line no-await-in-loop
      await axios.post(bot.webhookUrl, value);
    }

    return { status: "success" };
  }
}
