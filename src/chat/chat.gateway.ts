import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';

type ChatSocket = Socket & {
  data: {
    user?: JwtPayload;
  };
};

@Injectable()
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(client: ChatSocket) {
    const token = this.extractToken(client);

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      client.data.user = this.jwtService.verify<JwtPayload>(token, {
        secret:
          this.configService.get<string>('JWT_SECRET') ??
          'change-this-in-real-projects',
      });
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() payload: { roomId: string },
  ) {
    const user = this.requireSocketUser(client);
    await this.chatService.assertRoomAccess(user.sub, payload.roomId);
    await client.join(payload.roomId);

    return {
      event: 'room_joined',
      data: { roomId: payload.roomId },
    };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() payload: { roomId: string; body: string },
  ) {
    const user = this.requireSocketUser(client);
    const message = await this.chatService.createMessage(
      user.sub,
      payload.roomId,
      {
        body: payload.body,
      },
    );

    this.server.to(payload.roomId).emit('message_created', message);

    return {
      event: 'message_sent',
      data: message,
    };
  }

  private extractToken(client: ChatSocket) {
    const authToken = client.handshake.auth?.token;
    const headerValue = client.handshake.headers.authorization;

    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken.replace(/^Bearer\s+/i, '');
    }

    if (typeof headerValue === 'string' && headerValue.startsWith('Bearer ')) {
      return headerValue.replace(/^Bearer\s+/i, '');
    }

    return null;
  }

  private requireSocketUser(client: ChatSocket) {
    const user = client.data.user;

    if (!user) {
      throw new UnauthorizedException('Socket no autenticado.');
    }

    return user;
  }
}
