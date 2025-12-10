import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TicketsModule } from './tickets/tickets.module';
import { RatesModule } from './rates/rates.module';
import { AbonosModule } from './abonos/abonos.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RealtimeModule } from './realtime/realtime.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    VehiclesModule,
    TicketsModule,
    RatesModule,
    AbonosModule,
    ReportsModule,
    DashboardModule,
    RealtimeModule,
    ConfigModule,
  ],
})
export class AppModule {}

