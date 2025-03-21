import { MethodRouteEnum } from '@enum/method-route.enum';
import { Optional } from '@nestjs/common';
import { IsArray, IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class GroupDetailDto {
  @Optional()
  @IsMongoId()
  idGroupDetail: string;

  @IsOptional()
  @IsArray()
  @IsEnum(MethodRouteEnum, { each: true })
  accessMethods: MethodRouteEnum[];

  @IsOptional()
  @IsMongoId()
  _id?: string;

  @IsOptional()
  createdAt?: string;
}
