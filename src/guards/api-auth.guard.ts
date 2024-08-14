/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class ApiAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers["authorization"];

    if (!authorizationHeader) {
      throw new UnauthorizedException("No API token provided");
    }

    // Handle authorization without Bearer prefix
    const token =
      typeof authorizationHeader === "string"
        ? authorizationHeader
        : authorizationHeader[0];

    if (!this.authService.validateToken(token)) {
      throw new UnauthorizedException("Invalid API token");
    }

    return true;
  }
}
