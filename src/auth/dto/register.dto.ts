import { IsInt, IsString } from 'class-validator';
export class RegisterRequestDto {
  @IsString()
  password: string;
  @IsString()
  name: string;
  @IsInt()
  classNum: number;
}
