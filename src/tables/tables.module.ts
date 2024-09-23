import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JWTStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [DatabaseModule],
  controllers: [TablesController],
  providers: [TablesService, JWTStrategy],
})
export class TablesModule {}
