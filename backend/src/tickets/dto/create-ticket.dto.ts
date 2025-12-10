import { IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  vehicleId: string;
}

