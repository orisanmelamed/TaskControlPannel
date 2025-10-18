import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService, private cfg: ConfigService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const header = req.headers['authorization'] as string | undefined;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException();
    const token = header.slice(7);
    const payload = await this.jwt.verifyAsync(token, {
      secret: this.cfg.get<string>('JWT_ACCESS_SECRET'),
    });
    req.user = payload;
    return true;
  }
}