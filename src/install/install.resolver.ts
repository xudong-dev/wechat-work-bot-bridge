import { UnauthorizedException } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { CreateUserInput } from "../user/dtos/create-user-input.dto";
import { User } from "../user/user.entity";

@Resolver()
export class InstallResolver {
  @Mutation(() => User)
  public async install(@Args("input") input: CreateUserInput): Promise<User> {
    if (await User.findOne()) {
      throw new UnauthorizedException("若需要重装，请先删除所有用户。");
    }

    return User.create(input).save();
  }
}
