import { IsNumber, IsString } from 'class-validator';

export class CreateTableDto {
  @IsString()
  name: string;

  @IsNumber()
  restaurantId: number;
}
