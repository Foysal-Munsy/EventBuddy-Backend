import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import type { Response, Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;
    createUserDto['role'] = 'user'; // Assign default role
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { jwt, user } = await this.authService.findOne(loginUserDto);
    response.cookie('jwt', jwt, { httpOnly: true });
    return {
      message: 'Login successful',
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Get('user')
  async user(@Req() request: Request) {
    const token = request.cookies['jwt'] as string | undefined;
    if (!token) {
      return { message: 'Not authenticated' };
    }
    const payload = await this.authService.getUserFromToken(token);
    if (!payload) {
      return { message: 'Invalid token' };
    }
    return payload;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'Logout successful' };
  }
}
