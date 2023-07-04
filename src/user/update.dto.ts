import { IsEmail, IsOptional, IsString } from 'class-validator';
export class UserUpdateDto {
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsString()
  password?: string;
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  profilePhoto?: string;
  @IsOptional()
  @IsString()
  githubId?: string;
  @IsOptional()
  @IsString()
  instagramId?: string;
  @IsOptional()
  @IsString()
  facebookId?: string;
  @IsOptional()
  @IsString()
  linkedInId?: string;
  @IsOptional()
  @IsString()
  explanation?: string;
}
