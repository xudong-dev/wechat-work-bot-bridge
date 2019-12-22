import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { Bot } from "../bot/bot.entity";

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
