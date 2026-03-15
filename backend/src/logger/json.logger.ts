import { Injectable, LogLevel, LoggerService } from '@nestjs/common';

type ConsoleMethod = 'log' | 'warn' | 'error' | 'debug' | 'info';

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(
    level: LogLevel,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    return JSON.stringify({ level, message, optionalParams });
  }

  private write(
    method: ConsoleMethod,
    level: LogLevel,
    message: unknown,
    ...optionalParams: unknown[]
  ): void {
    console[method](this.formatMessage(level, message, ...optionalParams));
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.write('log', 'log', message, ...optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.write('error', 'error', message, ...optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.write('warn', 'warn', message, ...optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.write('debug', 'debug', message, ...optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.write('info', 'verbose', message, ...optionalParams);
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    this.write('error', 'fatal', message, ...optionalParams);
  }
}
