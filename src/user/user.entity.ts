import { Field, ID, ObjectType } from "@nestjs/graphql";
import bcrypt from "bcryptjs";
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn} from "typeorm";

import { Bot } from "../bot/bot.entity";
import { Schedule } from "../schedule/schedule.entity";
import { Webhook } from "../webhook/webhook.entity";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  // eslint-disable-next-line prettier/prettier
  #password: string;

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Field()
  @Column()
  public email: string;

  @Column()
  public password: string;

  @Field()
  @CreateDateColumn()
  public createdAt: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(
    () => Bot,
    bot => bot.owner
  )
  public ownBots: Bot[];

  @OneToMany(
    () => Webhook,
    webhook => webhook.owner
  )
  public ownWebhooks: Webhook[];

  @OneToMany(
    () => Schedule,
    schedule => schedule.owner
  )
  public ownSchedules: Schedule[];

  @Field(() => [Bot])
  @JoinTable()
  @ManyToMany(
    () => Bot,
    bot => bot.users
  )
  public bots: Bot[];

  @Field(() => [Webhook])
  @JoinTable()
  @ManyToMany(
    () => Webhook,
    webhook => webhook.users
  )
  public webhooks: Webhook[];

  @Field(() => [Schedule])
  @JoinTable()
  @ManyToMany(
    () => Schedule,
    schedule => schedule.users
  )
  public schedules: Schedule[];

  @AfterLoad()
  private loadTempPassword(): void {
    this.#password = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private encryptPassword(): void {
    if (this.#password !== this.password) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
      this.loadTempPassword();
    }
  }
}
