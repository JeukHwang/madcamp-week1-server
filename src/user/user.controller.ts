import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { Public } from 'src/auth/decorator/skip-auth.decorator';
import { CurrentUser } from './decorator/current.decorator';
import { UserProfile, UserService } from './user.service';
import { UserUpdateDto } from './update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('all')
  async getAll(): Promise<UserProfile[]> {
    return await this.userService.findAllProfile();
  }

  @Get('current')
  async getCurrentUser(@CurrentUser() user): Promise<User> {
    return user;
  }

  @Public()
  @Post('update')
  async update(@Body() userInfo: UserUpdateDto): Promise<UserProfile> {
    return await this.userService.update(userInfo);
  }

  @Public()
  @Get('get/:name')
  async get(@Param('name') name: string): Promise<UserProfile> {
    return await this.userService.findByName(name);
  }
}
