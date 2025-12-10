import { IsString, IsEnum, IsNumber } from 'class-validator';
import { VehicleType } from '@prisma/client';

export class CreateVehicleDto {
  @IsNumber()
  numeroPatente: number;

  @IsEnum(VehicleType)
  tipo: VehicleType;
}
