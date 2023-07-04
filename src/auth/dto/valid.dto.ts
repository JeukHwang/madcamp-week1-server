import { IsString } from 'class-validator';
export class ValidRequestDto {
  @IsString()
  password: string;
  @IsString()
  name: string;
}
