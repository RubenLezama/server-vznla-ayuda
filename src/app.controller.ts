import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Verificar si la API esta viva' })
  @ApiOkResponse({
    description: 'Estado simple de salud de la aplicacion.',
    schema: {
      example: {
        status: 'ok',
        service: 'venezuela-ayuda-api',
      },
    },
  })
  @Get()
  getHealth() {
    return this.appService.getHealth();
  }

  @ApiOperation({ summary: 'Ping ligero para monitores o cron jobs' })
  @ApiOkResponse({
    description: 'Respuesta ligera para mantener despierto el servicio.',
    schema: {
      example: {
        ok: true,
        service: 'venezuela-ayuda-api',
        timestamp: '2026-04-27T17:20:00.000Z',
      },
    },
  })
  @Get('ping')
  getPing() {
    return this.appService.getPing();
  }
}
