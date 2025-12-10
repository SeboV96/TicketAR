import { IsString, IsNumber, IsDateString, IsUUID, IsOptional, Min } from 'class-validator';

export class CreateAbonoDto {
  @IsUUID()
  vehicleId: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  rateId: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;
}

