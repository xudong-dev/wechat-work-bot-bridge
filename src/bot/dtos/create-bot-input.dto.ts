import { Field, InputType } from "type-graphql";

@InputType()
export class CreateBotInput {
  @Field()
  public name: string;

  @Field()
  public webhookUrl: string;
}
