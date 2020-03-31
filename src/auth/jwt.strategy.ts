import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from "../user/user.entity";
import { JWTPayload } from "./dtos/jwt-payload.dto";

const { JWT_SECRET } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public async validate(payload: JWTPayload): Promise<User> {
    return User.findOne({ where: { id: payload.sub } });
  }
}
