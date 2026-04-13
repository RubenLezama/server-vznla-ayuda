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
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una publicacion de ayuda o donacion' })
  @ApiOkResponse({ description: 'Publicacion creada.' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar publicaciones del MVP' })
  @ApiOkResponse({
    description: 'Listado filtrable por tipo, categoria o ciudad.',
  })
  findAll(@Query() query: QueryPostsDto) {
    return this.postsService.findAll(query);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Obtener el detalle de una publicacion' })
  @ApiOkResponse({ description: 'Detalle de la publicacion, autor y ofertas.' })
  findOne(@Param('postId') postId: string) {
    return this.postsService.findOne(postId);
  }

  @Patch(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una publicacion propia' })
  @ApiOkResponse({ description: 'Publicacion actualizada.' })
  update(
    @CurrentUser() user: JwtPayload,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(user.sub, postId, dto);
  }
}
