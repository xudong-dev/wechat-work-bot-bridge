import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateWebhookInput {
  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public code?: string;

  @Field({ nullable: true })
  public enable?: boolean;
}
