import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
