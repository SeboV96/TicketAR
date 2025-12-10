import { IsString, IsUUID } from 'class-validator';

export class ExitTicketDto {
  @IsUUID()
  vehicleId: string;

  @IsString()
  operadorId?: string;
}

