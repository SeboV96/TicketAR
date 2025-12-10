import { IsString, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  vehicleId: string;

  @IsString()
  operadorId?: string;
}

