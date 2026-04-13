import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una valoracion de agradecimiento' })
  @ApiOkResponse({ description: 'Valoracion creada correctamente.' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.sub, dto);
  }

  @Get('me/received')
  @ApiOperation({
    summary: 'Listar valoraciones recibidas por el usuario actual',
  })
  @ApiOkResponse({
    description: 'Valoraciones que ha recibido el usuario autenticado.',
  })
  findReceived(@CurrentUser() user: JwtPayload) {
    return this.reviewsService.findReceived(user.sub);
  }
}
