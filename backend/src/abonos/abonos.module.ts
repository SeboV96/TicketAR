import { Module } from '@nestjs/common';
import { AbonosService } from './abonos.service';
import { AbonosController } from './abonos.controller';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { RatesModule } from '../rates/rates.module';

@Module({
  imports: [VehiclesModule, RatesModule],
  controllers: [AbonosController],
  providers: [AbonosService],
  exports: [AbonosService],
})
export class AbonosModule {}

