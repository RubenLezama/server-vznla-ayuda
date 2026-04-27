import { AppService } from './app.service';

describe('AppService', () => {
  it('should return a simple health payload', () => {
    const service = new AppService();

    expect(service.getHealth()).toEqual({
      status: 'ok',
      service: 'venezuela-ayuda-api',
    });
  });

  it('should return a ping payload', () => {
    const service = new AppService();
    const ping = service.getPing();

    expect(ping.ok).toBe(true);
    expect(ping.service).toBe('venezuela-ayuda-api');
    expect(new Date(ping.timestamp).toString()).not.toBe('Invalid Date');
  });
});
