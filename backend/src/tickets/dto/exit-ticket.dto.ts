import { IsUUID } from 'class-validator';

export class ExitTicketDto {
  @IsUUID()
  vehicleId: string;
}

