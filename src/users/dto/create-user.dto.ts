import { IsEmail, IsIn, IsString } from 'class-validator';
import { Role } from 'types';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsIn(['admin', 'vendor', 'customer'])
  role: Role;

  @IsString()
  password: string;
}
