import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { Bot } from "../bot/bot.entity";
import { User } from "../user/user.entity";

@ObjectType()
@Entity()
export class Webhook extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Field()
  @Column()
  public name: string;

  @Field()
  @Column({ type: "text" })
  public code: string;

  @Field()
  @CreateDateColumn()
  public createdAt: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.ownWebhooks
  )
  owner: User;

  @Field(() => [User])
  @ManyToMany(
    () => User,
    user => user.webhooks
  )
  users: User[];

  @Field(() => [Bot], { nullable: true })
  @ManyToMany(
    () => Bot,
    bot => bot.webhooks,
    {
      onDelete: "CASCADE"
    }
  )
  public bots?: Bot[];
}
