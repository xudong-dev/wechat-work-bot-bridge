import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateBotInput {
  @Field()
  public name: string;

  @Field()
  public webhookUrl: string;
}
