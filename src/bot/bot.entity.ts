import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { Schedule } from "../schedule/schedule.entity";
import { User } from "../user/user.entity";
import { Webhook } from "../webhook/webhook.entity";

@ObjectType()
@Entity()
export class Bot extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Field()
  @Column()
  public name: string;

  @Field()
  @Column({ type: "text" })
  public webhookUrl: string;

  @Field()
  @CreateDateColumn()
  public createdAt: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.ownBots
  )
  owner: User;

  @Field(() => [User])
  @ManyToMany(
    () => User,
    user => user.bots
  )
  users: User[];

  @Field(() => [Webhook], { nullable: true })
  @JoinTable()
  @ManyToMany(
    () => Webhook,
    webhook => webhook.bots,
    {
      onDelete: "CASCADE"
    }
  )
  public webhooks?: Webhook[];

  @Field(() => [Schedule], { nullable: true })
  @JoinTable()
  @ManyToMany(
    () => Schedule,
    schedule => schedule.bots,
    {
      onDelete: "CASCADE"
    }
  )
  public schedules?: Schedule[];
}
