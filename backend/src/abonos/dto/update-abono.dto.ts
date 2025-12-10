import { PartialType } from '@nestjs/mapped-types';
import { CreateAbonoDto } from './create-abono.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAbonoDto extends PartialType(CreateAbonoDto) {
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

