import { IsOptional, IsString } from 'class-validator';
import { Role } from 'types';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  role?: Role;
}
