import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './auth.validation';
import User from '@database/models/user.model';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await User.query().findOne({ email });
    const validPassword = await bcrypt.compare(password, user?.password || '');

    return validPassword ? user! : null;
  }

  async signIn(email: string, password: string): Promise<object> {
    const user = await this.validateUser(email, password);

    if (user) {
      return this.getTokens(user);
    }

    throw new UnauthorizedException('Invalid credentials', {
      description: 'auth.invalid_credentials',
    });
  }

  async signUp(data: SignUpDto): Promise<object> {
    const hashedData = {
      ...data,
      password: await bcrypt.hash(data.password, 10),
    };

    const user = await User.query().insert(hashedData);

    return await this.getTokens(user);
  }

  async refresh(email: string, refreshToken: string): Promise<object> {
    const user = await User.query().findOne({ email });

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const validToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      if (validToken) {
        return await this.getTokens(user);
      }
    }

    throw new UnauthorizedException('Invalid credentials', {
      description: 'auth.invalid_refresh_token',
    });
  }

  private async getTokens(user: User): Promise<object> {
    const payload = { sub: user.id, email: user.email, slug: user.slug };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };
  }
}
