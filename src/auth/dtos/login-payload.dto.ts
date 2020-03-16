import { Field, ObjectType } from "@nestjs/graphql";

import { User } from "../../user/user.entity";

@ObjectType()
export class LoginPayload {
  @Field()
  public token: string;

  @Field()
  public user: User;
}
