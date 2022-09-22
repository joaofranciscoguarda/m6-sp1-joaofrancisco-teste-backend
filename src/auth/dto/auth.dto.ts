import {IsEmail, IsNotEmpty, IsString} from 'class-validator'

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  cellphone: string

  @IsString()
  @IsNotEmpty()
  password: string;
}