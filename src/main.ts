import "dotenv/config";
import "source-map-support/register";

import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module";

(async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.useLogger(app.get(Logger));

  await app.listen(process.env.PORT || 5000);
})();
