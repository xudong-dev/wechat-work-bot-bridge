import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateScheduleInput {
  @Field()
  public name: string;

  @Field()
  public code: string;

  @Field()
  public cron: string;

  @Field({ nullable: true })
  public enable?: boolean;
}
