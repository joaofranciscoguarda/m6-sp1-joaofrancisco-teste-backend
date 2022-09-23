import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  cellphone: string;
}
