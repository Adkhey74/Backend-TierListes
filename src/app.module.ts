import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './infrastructure/config/modules/user.module';
import { AuthModule } from './infrastructure/config/modules/auth.module';
import { LogoModule } from './infrastructure/config/modules/logo.module';
import { StorageModule } from './infrastructure/config/modules/storage.module';
import { TierListModule } from './infrastructure/config/modules/tier-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    LogoModule,
    StorageModule,
    TierListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
