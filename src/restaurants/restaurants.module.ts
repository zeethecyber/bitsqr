import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JWTStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [DatabaseModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, JWTStrategy],
})
export class RestaurantsModule {}
