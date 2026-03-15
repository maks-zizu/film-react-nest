import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats message to tskv string', () => {
    expect(
      logger.formatMessage('warn', 'slow query', 123, { table: 'films' }),
    ).toBe(
      'level=warn\tmessage=slow query\toptionalParams=[123,{"table":"films"}]',
    );
  });

  it('escapes tab and new line characters', () => {
    expect(logger.formatMessage('log', 'line1\tline2\nline3')).toBe(
      'level=log\tmessage=line1\\tline2\\nline3',
    );
  });

  it('writes warn level to console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    logger.warn('low disk', { remaining: '5GB' });

    expect(spy).toHaveBeenCalledWith(
      'level=warn\tmessage=low disk\toptionalParams=[{"remaining":"5GB"}]',
    );
  });
});
