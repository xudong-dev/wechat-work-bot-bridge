import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateWebhookInput {
  @Field()
  public name: string;

  @Field()
  public code: string;

  @Field({ nullable: true })
  public enable?: boolean;
}
