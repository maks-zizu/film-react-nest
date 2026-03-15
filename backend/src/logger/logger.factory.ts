import { LoggerService } from '@nestjs/common';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export type AppLoggerType = 'dev' | 'json' | 'tskv';

const normalizeLoggerType = (rawType?: string): AppLoggerType => {
  const value = rawType?.toLowerCase();
  if (value === 'dev' || value === 'json' || value === 'tskv') {
    return value;
  }

  return process.env.NODE_ENV === 'production' ? 'json' : 'dev';
};

export const createAppLogger = (rawType?: string): LoggerService => {
  const loggerType = normalizeLoggerType(rawType);

  switch (loggerType) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    case 'dev':
    default:
      return new DevLogger();
  }
};
