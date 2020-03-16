import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateBotInput {
  @Field()
  public name: string;

  @Field()
  public webhookUrl: string;
}
