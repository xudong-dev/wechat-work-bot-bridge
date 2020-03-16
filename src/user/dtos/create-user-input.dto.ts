import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
  @Field()
  public email: string;

  @Field()
  public password: string;
}
