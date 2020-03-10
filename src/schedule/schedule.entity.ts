import { Field, ID, ObjectType } from "type-graphql";
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
export class Schedule extends BaseEntity {
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
  @Column()
  public cron: string;

  @Field()
  @Column({ default: false })
  public enable: boolean;

  @Field()
  @CreateDateColumn()
  public createdAt: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.ownSchedules
  )
  owner: User;

  @Field(() => [User])
  @ManyToMany(
    () => User,
    user => user.schedules
  )
  users: User[];

  @Field(() => [Bot], { nullable: true })
  @ManyToMany(
    () => Bot,
    bot => bot.schedules,
    {
      onDelete: "CASCADE"
    }
  )
  public bots?: Bot[];
}
