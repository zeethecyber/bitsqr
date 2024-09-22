import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalGuard } from 'src/guards/local.guard';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('whoami')
  @UseGuards(JwtGuard)
  whoAmI(@Req() req: Request) {
    return req.user;
  }

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    const user = req.user;
    return this.authService.login(user);
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  changePassword(@Req() req: Request, @Body() body: UpdatePasswordDto) {
    const { oldPassword, newPassword } = body;
    return this.authService.changePassword(req.user, oldPassword, newPassword);
  }
}
