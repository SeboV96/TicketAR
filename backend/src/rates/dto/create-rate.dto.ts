import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { RateType } from '@prisma/client';

export class CreateRateDto {
  @IsString()
  nombre: string;

  @IsEnum(RateType)
  tipo: RateType;

  @IsNumber()
  @Min(0)
  precio: number;
}

