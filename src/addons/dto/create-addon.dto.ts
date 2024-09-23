import { IsNumber, IsString } from 'class-validator';

export class CreateAddonDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  restaurantId: number;
}
