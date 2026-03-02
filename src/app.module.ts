import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { MangasModule } from './mangas/mangas.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './common/guards/api-key.guard';

@Module({
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard }, // exécuté en 1er
    { provide: APP_GUARD, useClass: ApiKeyGuard },    // exécuté en 2nd
    AppService
  ],
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000, // fenêtre de 1 minute en ms
          limit: 100, // max 100 requêtes par fenêtre par IP
        },
      ],
    }),
    StorageModule,
    MangasModule,
    AuthModule,
  ],
})
export class AppModule {}