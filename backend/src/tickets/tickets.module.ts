import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { RatesModule } from '../rates/rates.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [VehiclesModule, RatesModule, RealtimeModule],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}

