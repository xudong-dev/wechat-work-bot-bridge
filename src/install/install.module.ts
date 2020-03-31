import { Module } from "@nestjs/common";

import { UserModule } from "../user/user.module";
import { InstallResolver } from "./install.resolver";

@Module({
  imports: [UserModule],
  providers: [InstallResolver],
})
export class InstallModule {}
