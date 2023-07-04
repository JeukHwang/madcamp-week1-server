import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterRequestDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserUpdateDto } from './update.dto';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  profilePhoto: string;
  githubId: string;
  instagramId: string;
  facebookId: string;
  linkedInId: string;
  explanation: string;
};

export function toUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    profilePhoto: user.profilePhoto,
    githubId: user.githubId,
    instagramId: user.instagramId,
    facebookId: user.facebookId,
    linkedInId: user.linkedInId,
    explanation: user.explanation,
  };
}

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userInfo: RegisterRequestDto): Promise<User | null> {
    try {
      const defaultProfilePhoto =
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
      const user = await this.prismaService.user.create({
        data: {
          ...userInfo,
          profilePhoto: defaultProfilePhoto,
        },
      });
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this email',
          );
          throw new UnauthorizedException('Unique constraint violated');
        }
      }
      throw e;
    }
  }

  async update(userInfo: UserUpdateDto): Promise<UserProfile> {
    try {
      await this.prismaService.user.updateMany({
        where: { name: userInfo.name },
        data: {
          ...userInfo,
        },
      });
      return await this.prismaService.user.findFirst({
        where: { name: userInfo.name },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this email',
          );
          throw new UnauthorizedException('Unique constraint violated');
        }
      }
      throw e;
    }
  }

  async findAllProfile(): Promise<UserProfile[]> {
    const users = await this.prismaService.user.findMany({
      where: { deletedAt: null },
    });
    return users.map(toUserProfile);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: { deletedAt: null, id },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: { deletedAt: null, email },
    });
    return user;
  }

  async removeById(id: string) {
    // TODO: change into soft delete middleware
    await this.prismaService.user.updateMany({
      where: { deletedAt: null, id },
      data: { deletedAt: new Date() },
    });
  }

  async setRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    // console.log(hashedRefreshToken);
    await this.prismaService.user.updateMany({
      where: { deletedAt: null, id },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async getUserIfRefreshTokenMatches(
    id: string,
    refreshToken: string,
  ): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    return isRefreshTokenMatching ? user : null;
  }

  removeRefreshToken(id: string) {
    this.prismaService.user.updateMany({
      where: { deletedAt: null, id },
      data: { refreshToken: null },
    });
  }
}
