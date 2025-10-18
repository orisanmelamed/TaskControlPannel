import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private cfg: ConfigService,
    private prisma: PrismaService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new BadRequestException('Email already registered');
    const user = await this.users.createUser(email, password, name);
    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.saveRefresh(user.id, tokens.refreshToken);
    return { user, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.saveRefresh(user.id, tokens.refreshToken);
    return { user: { id: user.id, email: user.email, role: user.role, name: user.name }, ...tokens };
  }

  async refresh(oldToken: string) {
    const payload = await this.verifyRefresh(oldToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { token: oldToken } });
    if (!stored || stored.isRevoked || stored.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    const tokens = await this.issueTokens(user.id, user.email, user.role);
    // rotate: revoke old, save new
    await this.prisma.refreshToken.update({ where: { token: oldToken }, data: { isRevoked: true } });
    await this.saveRefresh(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken, isRevoked: false },
      data: { isRevoked: true },
    });
    return { ok: true };
  }

  private async issueTokens(userId: string, email: string, role: string) {
    const accessPayload = { sub: userId, email, role, typ: 'access' };
    const refreshPayload = { sub: userId, email, role, typ: 'refresh' };

    const accessToken = await this.jwt.signAsync(accessPayload, {
      secret: this.cfg.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.cfg.get<string>('JWT_ACCESS_TTL') ?? '15m',
    });

    const refreshToken = await this.jwt.signAsync(refreshPayload, {
      secret: this.cfg.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.cfg.get<string>('JWT_REFRESH_TTL') ?? '7d',
    });

    return { accessToken, refreshToken };
  }

  private async verifyRefresh(token: string) {
    return this.jwt.verifyAsync(token, { secret: this.cfg.get<string>('JWT_REFRESH_SECRET') });
  }

  private async saveRefresh(userId: string, token: string) {
    const decoded = await this.verifyRefresh(token);
    const expMs = (decoded.exp as number) * 1000;
    await this.prisma.refreshToken.create({
      data: { userId, token, expiresAt: new Date(expMs) },
    });
  }
}