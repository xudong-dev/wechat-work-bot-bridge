import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard as BaseAuthGuard } from "@nestjs/passport";
import { IncomingMessage } from "http";

@Injectable()
export class AuthGuard extends BaseAuthGuard("jwt") {
  // eslint-disable-next-line class-methods-use-this
  public getRequest(context: ExecutionContext): IncomingMessage {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
