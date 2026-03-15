import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats message to json string', () => {
    expect(logger.formatMessage('log', 'hello', 42, { requestId: 'r1' })).toBe(
      '{"level":"log","message":"hello","optionalParams":[42,{"requestId":"r1"}]}',
    );
  });

  it('writes log level to console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    logger.log('event', { status: 'ok' });

    expect(spy).toHaveBeenCalledWith(
      '{"level":"log","message":"event","optionalParams":[{"status":"ok"}]}',
    );
  });

  it('writes error level to console.error', () => {
    const spy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('boom', 'stacktrace');

    expect(spy).toHaveBeenCalledWith(
      '{"level":"error","message":"boom","optionalParams":["stacktrace"]}',
    );
  });
});
