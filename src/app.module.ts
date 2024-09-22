import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, DatabaseModule, AuthModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
