import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { AuthService } from "./auth.service";
import { LoginPayload } from "./dtos/login-payload.dto";

@Resolver()
export class AuthResolver {
  public constructor(private readonly authService: AuthService) {
    return this;
  }

  @Mutation(() => LoginPayload)
  public async login(
    @Args("email") email: string,
    @Args("password") password: string
  ): Promise<LoginPayload> {
    const user = await this.authService.validateUser(email, password);
    const token = await this.authService.generateToken(user);
    return { user, token };
  }
}
