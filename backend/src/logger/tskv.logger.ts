import { Injectable, LogLevel, LoggerService } from '@nestjs/common';

type ConsoleMethod = 'log' | 'warn' | 'error' | 'debug' | 'info';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(
    level: LogLevel,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const fields: Array<[string, string]> = [
      ['level', String(level)],
      ['message', this.stringify(message)],
    ];

    if (optionalParams.length > 0) {
      fields.push(['optionalParams', this.stringify(optionalParams)]);
    }

    return fields
      .map(([key, value]) => `${key}=${this.escape(value)}`)
      .join('\t');
  }

  private stringify(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    return JSON.stringify(value);
  }

  private escape(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n');
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
