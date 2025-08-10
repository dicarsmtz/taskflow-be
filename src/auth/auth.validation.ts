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
  @Expose({ name: 'first_name' })
  firstName!: string;
  @Expose({ name: 'last_name' })
  lastName!: string;
  slug!: string;
  email!: string;
  password!: string;
}
