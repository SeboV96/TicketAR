import { IsString, IsEnum } from 'class-validator';
import { VehicleType } from '@prisma/client';

export class CreateVehicleDto {
  @IsString()
  patente: string;

  @IsEnum(VehicleType)
  tipo: VehicleType;
}

