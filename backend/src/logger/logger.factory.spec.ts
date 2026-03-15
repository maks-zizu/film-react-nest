import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { createAppLogger } from './logger.factory';
import { TskvLogger } from './tskv.logger';

describe('createAppLogger', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('returns DevLogger for dev type', () => {
    expect(createAppLogger('dev')).toBeInstanceOf(DevLogger);
  });

  it('returns JsonLogger for json type', () => {
    expect(createAppLogger('json')).toBeInstanceOf(JsonLogger);
  });

  it('returns TskvLogger for tskv type', () => {
    expect(createAppLogger('tskv')).toBeInstanceOf(TskvLogger);
  });

  it('falls back to DevLogger for unknown type in non-production env', () => {
    process.env.NODE_ENV = 'development';

    expect(createAppLogger('unknown')).toBeInstanceOf(DevLogger);
  });

  it('falls back to JsonLogger for unknown type in production env', () => {
    process.env.NODE_ENV = 'production';

    expect(createAppLogger('unknown')).toBeInstanceOf(JsonLogger);
  });
});
