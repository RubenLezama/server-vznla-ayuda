import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  @ApiOperation({ summary: 'Listar mis salas de chat' })
  @ApiOkResponse({
    description: 'Salas donde participa el usuario autenticado.',
  })
  listRooms(@CurrentUser() user: JwtPayload) {
    return this.chatService.listRooms(user.sub);
  }

  @Get('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Listar mensajes de una sala' })
  @ApiOkResponse({ description: 'Historial de mensajes de la sala.' })
  getMessages(
    @CurrentUser() user: JwtPayload,
    @Param('roomId') roomId: string,
  ) {
    return this.chatService.getMessages(user.sub, roomId);
  }

  @Post('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Enviar un mensaje por REST' })
  @ApiOkResponse({ description: 'Mensaje creado correctamente.' })
  createMessage(
    @CurrentUser() user: JwtPayload,
    @Param('roomId') roomId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.chatService.createMessage(user.sub, roomId, dto);
  }
}
