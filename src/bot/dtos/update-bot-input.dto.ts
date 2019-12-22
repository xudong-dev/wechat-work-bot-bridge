import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateBotInput {
  @Field()
  public name: string;

  @Field()
  public webhookUrl: string;
}
