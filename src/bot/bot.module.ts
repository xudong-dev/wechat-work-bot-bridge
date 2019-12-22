import { Module } from "@nestjs/common";

import { BotResolver } from "./bot.resolver";

@Module({
  providers: [BotResolver]
})
export class BotModule {}
