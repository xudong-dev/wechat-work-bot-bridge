import { Module } from "@nestjs/common";

import { SandboxModule } from "../sandbox/sandbox.module";
import { WebhookController } from "./webhook.controller";
import { WebhookResolver } from "./webhook.resolver";

@Module({
  imports: [SandboxModule],
  controllers: [WebhookController],
  providers: [WebhookResolver],
})
export class WebhookModule {}
