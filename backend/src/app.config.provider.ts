import { ConfigModule, ConfigService } from '@nestjs/config';

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

export interface AppConfig {
  database: AppConfigDatabase;
  debug?: string;
}

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (cfg: ConfigService): AppConfig => ({
    database: {
      driver: cfg.get<string>('DATABASE_DRIVER') ?? 'mongodb',
      url: cfg.get<string>('DATABASE_URL') ?? 'mongodb://127.0.0.1:27017/prac',
    },
    debug: cfg.get<string>('DEBUG') ?? '',
  }),
};
