import { RoleEnum } from '@enum/role-user.enum';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { GroupDetailType } from 'src/util/types/group-detail.type';
import { GroupDetailDto } from './group-detail.dto';

export class UpdateRolesDto {
  @IsOptional()
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groups: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupDetailDto)
  groupDetails: GroupDetailType[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groupAPIAccesses: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groupAPIDenines: string[];
}
