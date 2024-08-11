/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly validTokens: string[] = ['Uml5YVNoYXJtYQ==']; 

  validateToken(token: string): boolean {
    if (!this.validTokens.includes(token)) {
      throw new UnauthorizedException('Invalid API token');
    }
    return true;
  }
}


