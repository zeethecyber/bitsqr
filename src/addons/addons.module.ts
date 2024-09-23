import { Module } from '@nestjs/common';
import { AddonsService } from './addons.service';
import { AddonsController } from './addons.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JWTStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [DatabaseModule],
  controllers: [AddonsController],
  providers: [AddonsService, JWTStrategy],
})
export class AddonsModule {}
