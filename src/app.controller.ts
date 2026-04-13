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
}
