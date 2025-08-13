import { AuthGuard, Public } from './auth.guard';
import { SignInDto, SignUpDto, RefreshDto } from './auth.validation';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<object> {
    return await this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<object> {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto): Promise<object> {
    return await this.authService.refresh(
      refreshDto.email,
      refreshDto.refreshToken,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('sign-out')
  signOut() {
    return 'logout';
  }
}
