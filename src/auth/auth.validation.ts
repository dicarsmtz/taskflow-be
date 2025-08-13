import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import * as z from 'zod';

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export class SignInDto {
  email!: string;
  password!: string;
}

export const SignUpSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  slug: z.string().min(1).max(30),
  email: z.email(),
  password: z.string().min(8).max(64),
});

export class SignUpDto {
  @ApiProperty({ name: 'first_name' })
  @Expose({ name: 'first_name' })
  firstName!: string;
  @ApiProperty({ name: 'last_name' })
  @Expose({ name: 'last_name' })
  lastName!: string;
  slug!: string;
  email!: string;
  password!: string;
}

export const RefreshSchema = z.object({
  email: z.email(),
  refresh_token: z.string(),
});

export class RefreshDto {
  email!: string;
  @ApiProperty({ name: 'refresh_token' })
  @Expose({ name: 'refresh_token' })
  refreshToken!: string;
}
