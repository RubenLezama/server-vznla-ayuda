import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { OffersModule } from './offers/offers.module';
import { ChatModule } from './chat/chat.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PrismaModule } from './prisma/prisma.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    OffersModule,
    ChatModule,
    ReviewsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
