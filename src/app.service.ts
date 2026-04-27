import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'venezuela-ayuda-api',
    };
  }

  getPing() {
    return {
      ok: true,
      service: 'venezuela-ayuda-api',
      timestamp: new Date().toISOString(),
    };
  }
}
