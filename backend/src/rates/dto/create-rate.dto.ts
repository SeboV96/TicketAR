import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { RateType } from '@prisma/client';

export class CreateRateDto {
  @IsString()
  nombre: string;

  @IsEnum(RateType)
  tipo: RateType;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  fraccionMin?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  fraccionMax?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(23)
  horaInicio?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(23)
  horaFin?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(6)
  diaSemana?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

