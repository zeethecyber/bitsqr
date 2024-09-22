import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { JWTStrategy } from 'src/strategies/jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, JWTStrategy],
})
export class CategoriesModule {}
