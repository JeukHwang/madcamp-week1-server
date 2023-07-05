import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserFeed } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateFeedRequestDto, UpdateFeedRequestDto } from './dto/feed.dto';

export type FeedProfile = {
  id: string;
  photo: string;
  content: string;
  authorName: string;
  taggedUserName: string[];
};

export function toFeedProfile(feed: any): FeedProfile {
  return {
    id: feed.id,
    photo: feed.photo,
    content: feed.content,
    authorName: feed.author.name,
    taggedUserName: feed.tagged.name,
  };
}

@Injectable()
export class FeedService {
  constructor(
    private prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<FeedProfile[]> {
    const feeds = await this.prismaService.feed.findMany({
      include: { author: true, userFeed: { include: { taggedUser: true } } },
    });

    return feeds.map((feed) => {
      return {
        id: feed.id,
        photo: feed.photo,
        content: feed.content,
        authorName: feed.author.name,
        taggedUserName: feed.userFeed.map(
          (userFeed) => userFeed.taggedUser.name,
        ),
      };
    });
  }

  async findAllWrittenBy(name: string): Promise<FeedProfile[]> {
    const feeds = await this.prismaService.feed.findMany({
      where: { authorName: name },
      include: { author: true, userFeed: { include: { taggedUser: true } } },
    });

    return feeds.map((feed) => {
      return {
        id: feed.id,
        photo: feed.photo,
        content: feed.content,
        authorName: feed.author.name,
        taggedUserName: feed.userFeed.map(
          (userFeed) => userFeed.taggedUser.name,
        ),
      };
    });
  }

  async findAllTaggedBy(name: string): Promise<FeedProfile[]> {
    const feeds = await this.prismaService.feed.findMany({
      where: { userFeed: { some: { taggedUser: { name } } } },
      include: { author: true, userFeed: { include: { taggedUser: true } } },
    });

    return feeds.map((feed) => {
      return {
        id: feed.id,
        photo: feed.photo,
        content: feed.content,
        authorName: feed.author.name,
        taggedUserName: feed.userFeed.map(
          (userFeed) => userFeed.taggedUser.name,
        ),
      };
    });
  }

  async findById(id: string): Promise<FeedProfile> {
    const feed = await this.prismaService.feed.findUnique({
      where: { id },
      include: { author: true, userFeed: { include: { taggedUser: true } } },
    });
    return {
      id: feed.id,
      photo: feed.photo,
      content: feed.content,
      authorName: feed.author.name,
      taggedUserName: feed.userFeed.map((userFeed) => userFeed.taggedUser.name),
    };
  }

  async create(feedInfo: CreateFeedRequestDto): Promise<FeedProfile> {
    const isValid = await this.userService.valid(
      feedInfo.name,
      feedInfo.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid user: cannot create');
    }
    try {
      for (const name of feedInfo.taggedName) {
        const user = await this.userService.findByName(name);
        if (!user) {
          throw new UnauthorizedException('Invalid user: cannot create');
        }
      }
      const feed = await this.prismaService.feed.create({
        data: {
          photo: feedInfo.photo,
          content: feedInfo.content,
          authorName: feedInfo.name,
        },
      });
      const userFeeds: UserFeed[] = [];
      for (const name of feedInfo.taggedName) {
        const userFeed = await this.prismaService.userFeed.create({
          data: {
            taggedUserName: name,
            feedId: feed.id,
          },
        });
        userFeeds.push(userFeed);
      }
      return this.findById(feed.id);
    } catch {
      throw new UnauthorizedException('Invalid user: cannot create');
    }
  }

  async update(feedInfo: UpdateFeedRequestDto): Promise<FeedProfile> {
    const isValid = await this.userService.valid(
      feedInfo.name,
      feedInfo.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid user: cannot create');
    }
    await this.prismaService.userFeed.deleteMany({
      where: { feedId: feedInfo.feedId },
    });
    await this.prismaService.feed.deleteMany({
      where: { id: feedInfo.feedId },
    });
    return this.create(feedInfo);
  }
}
