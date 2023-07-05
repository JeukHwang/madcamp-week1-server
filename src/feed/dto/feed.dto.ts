import { IsString } from 'class-validator';
export class CreateFeedRequestDto {
  @IsString()
  name: string;
  @IsString()
  password: string;
  @IsString()
  photo: string;
  @IsString()
  content: string;
  @IsString({ each: true })
  taggedName: string[];
}

export class UpdateFeedRequestDto {
  @IsString()
  feedId: string;
  @IsString()
  name: string;
  @IsString()
  password: string;
  @IsString()
  photo: string;
  @IsString()
  content: string;
  @IsString({ each: true })
  taggedName: string[];
}

export class GetOneFeedRequestDto {
  @IsString()
  id: string;
}

export class GetFilterFeedRequestDto {
  @IsString()
  name: string;
}
