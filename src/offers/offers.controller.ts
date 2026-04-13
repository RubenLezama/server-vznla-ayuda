import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer-status.dto';
import { QueryMyOffersDto } from './dto/query-my-offers.dto';

@ApiTags('offers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('posts/:postId/offers')
  @ApiOperation({ summary: 'Crear una oferta para ayudar en una publicacion' })
  @ApiOkResponse({ description: 'Oferta creada y chat habilitado.' })
  create(
    @Param('postId') postId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOfferDto,
  ) {
    return this.offersService.create(postId, user.sub, dto);
  }

  @Get('offers')
  @ApiOperation({ summary: 'Listar mis ofertas enviadas o recibidas' })
  @ApiOkResponse({ description: 'Ofertas del usuario autenticado.' })
  findMyOffers(
    @CurrentUser() user: JwtPayload,
    @Query() query: QueryMyOffersDto,
  ) {
    return this.offersService.findMyOffers(user.sub, query.kind);
  }

  @Get('offers/:offerId')
  @ApiOperation({ summary: 'Obtener una oferta puntual' })
  @ApiOkResponse({ description: 'Oferta con datos del post, donante y chat.' })
  findOne(@Param('offerId') offerId: string, @CurrentUser() user: JwtPayload) {
    return this.offersService.findOne(offerId, user.sub);
  }

  @Patch('offers/:offerId/status')
  @ApiOperation({ summary: 'Cambiar el estado de una oferta' })
  @ApiOkResponse({ description: 'Estado de la oferta actualizado.' })
  updateStatus(
    @Param('offerId') offerId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateOfferStatusDto,
  ) {
    return this.offersService.updateStatus(user.sub, offerId, dto);
  }
}
