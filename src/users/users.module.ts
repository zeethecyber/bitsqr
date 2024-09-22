import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JWTStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, JWTStrategy],
})
export class UsersModule {}
