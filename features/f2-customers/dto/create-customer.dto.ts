import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export default class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail({})
  @IsNotEmpty({})
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
