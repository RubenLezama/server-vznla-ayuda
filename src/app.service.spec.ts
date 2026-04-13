import { AppService } from './app.service';

describe('AppService', () => {
  it('should return a simple health payload', () => {
    const service = new AppService();

    expect(service.getHealth()).toEqual({
      status: 'ok',
      service: 'venezuela-ayuda-api',
    });
  });
});
