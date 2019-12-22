import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";

import { AuthModule } from "./auth/auth.module";
import { Bot } from "./bot/bot.entity";
import { BotModule } from "./bot/bot.module";
import { NamingStrategy } from "./common/naming.strategy";
import { InstallModule } from "./install/install.module";
import { Schedule } from "./schedule/schedule.entity";
import { ScheduleModule } from "./schedule/schedule.module";
import { User } from "./user/user.entity";
import { UserModule } from "./user/user.module";
import { Webhook } from "./webhook/webhook.entity";
import { WebhookModule } from "./webhook/webhook.module";

const { DATABASE_URL, DATABASE_SSL } = process.env;

@Module({
  imports: [
    GraphQLModule.forRoot({
      tracing: true,
      autoSchemaFile: true,
      introspection: true,
      playground: true,
      context: ({ req }) => ({ req })
    }),
    TypeOrmModule.forRoot({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: DATABASE_URL.replace(/^(.*?):\/\/.*?$/, "$1") as any,
      url: DATABASE_URL,
      entities: [Bot, Webhook, Schedule, User],
      synchronize: true,
      namingStrategy: new NamingStrategy(),
      ...(DATABASE_SSL === "true"
        ? {
            extra: {
              ssl: true
            }
          }
        : {})
    }),
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
