import { IsIn, IsString, ValidateIf } from 'class-validator';
import { Role } from 'types';

export class CreateAuthDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsIn(['admin', 'vendor', 'customer'])
  role: Role;

  @ValidateIf((o) => o.role === 'vendor')
  @IsString()
  address: string;
}
