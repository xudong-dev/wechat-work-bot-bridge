import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerModule } from "nestjs-pino";
import { join } from "path";

import { AuthModule } from "./auth/auth.module";
import { BotModule } from "./bot/bot.module";
import { InstallModule } from "./install/install.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { UserModule } from "./user/user.module";
import { WebhookModule } from "./webhook/webhook.module";

@Module({
  imports: [
    LoggerModule.forRoot(),
    GraphQLModule.forRoot({
      tracing: true,
      autoSchemaFile: true,
      introspection: true,
      playground: true,
      context: ({ req }) => ({ req })
    }),
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "./client/build")
    }),
    AuthModule,
    BotModule,
    InstallModule,
    ScheduleModule,
    UserModule,
    WebhookModule
  ]
})
export class AppModule {}
