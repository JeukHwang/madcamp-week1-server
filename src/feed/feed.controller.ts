import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorator/skip-auth.decorator';
import {
  CreateFeedRequestDto,
  GetFilterFeedRequestDto,
  GetOneFeedRequestDto,
  UpdateFeedRequestDto,
} from './dto/feed.dto';
import { FeedProfile, FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Public()
  @Get()
  async getAll(): Promise<FeedProfile[]> {
    return await this.feedService.findAll();
  }
  @Public()
  @Post('one')
  async getOne(@Body() body: GetOneFeedRequestDto): Promise<FeedProfile> {
    return await this.feedService.findById(body.id);
  }
  @Public()
  @Post('wrote')
  async getWrote(
    @Body() body: GetFilterFeedRequestDto,
  ): Promise<FeedProfile[]> {
    return await this.feedService.findAllWrittenBy(body.name);
  }
  @Public()
  @Post('tagged')
  async getTagged(
    @Body() body: GetFilterFeedRequestDto,
  ): Promise<FeedProfile[]> {
    return await this.feedService.findAllTaggedBy(body.name);
  }
  @Public()
  @Post('create')
  async create(@Body() body: CreateFeedRequestDto): Promise<FeedProfile> {
    return await this.feedService.create(body);
  }
  @Public()
  @Post('update')
  async update(@Body() body: UpdateFeedRequestDto): Promise<FeedProfile> {
    return await this.feedService.update(body);
  }
}
