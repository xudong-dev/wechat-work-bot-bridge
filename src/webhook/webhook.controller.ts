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
import retry from "async-retry";
import axios from "axios";
import { PinoLogger } from "nestjs-pino";

import { SandboxService } from "../sandbox/sandbox.service";
import { Webhook } from "./webhook.entity";

const fetch = axios.create({ timeout: 10000 });

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

    if (value) {
      await Promise.all(
        webhook.bots.map(bot =>
          (async (): Promise<void> => {
            try {
              await retry(
                async bail => {
                  try {
                    await fetch.post(bot.webhookUrl, value);
                  } catch (err) {
                    bail(err);
                  }
                },
                { retries: 3 }
              );
            } catch (err) {
              this.logger.error(
                { id: bot.id, webhookUrl: bot.webhookUrl },
                "call bot error"
              );
            }
          })()
        )
      );
    }

    return { status: "success" };
  }
}
