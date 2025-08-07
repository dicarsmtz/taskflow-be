import User from '@database/models/user.model';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await User.query().findOne({ email, password });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials', {
        description: 'auth.invalid_credentials',
      });
    }

    const payload = { sub: user.id, email: user.email, slug: user.slug };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
