import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri:
          cfg.get<string>('DATABASE_URL') ?? 'mongodb://127.0.0.1:27017/prac',
      }),
    }),
  ],
})
export class DatabaseModule {}
