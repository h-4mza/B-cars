import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Get('setup-admin')
  async setupAdmin() {
    const existingAdmin = await this.prisma.user.findFirst({
      where: { email: 'admin@carjet.com' }
    });
    if (existingAdmin) {
      return { message: 'Admin already exists' };
    }
    
    const hashedPassword = await argon2.hash('admin123', { type: argon2.argon2id });
    await this.prisma.user.create({
      data: {
        email: 'admin@carjet.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    return { message: 'Admin user created successfully! Email: admin@carjet.com, Pass: admin123' };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.register(dto);
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Registration successful' };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Login successful', accessToken: tokens.accessToken };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Tokens refreshed' };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    return req.user;
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true, // Always true for SameSite=none
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // Always true for SameSite=none
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
