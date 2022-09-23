import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditContactDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  cellphone?: string;
}
