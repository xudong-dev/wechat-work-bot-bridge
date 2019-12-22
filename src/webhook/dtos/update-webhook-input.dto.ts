import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateWebhookInput {
  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public code?: string;

  @Field({ nullable: true })
  public enable?: boolean;
}
