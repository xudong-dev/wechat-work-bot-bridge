import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateScheduleInput {
  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public code?: string;

  @Field({ nullable: true })
  public cron?: string;

  @Field({ nullable: true })
  public enable?: boolean;
}
