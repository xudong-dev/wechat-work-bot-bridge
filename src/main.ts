import "dotenv/config";
import "source-map-support/register";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

(async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 5000);
})();
