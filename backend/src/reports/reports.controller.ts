import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Response } from 'express';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('movements')
  async getMovementsReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('format') format: 'csv' | 'excel' = 'excel',
    @Res() res: Response,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const buffer = await this.reportsService.generateMovementsReport(start, end, format);

    const extension = format === 'csv' ? 'csv' : 'xlsx';
    const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=movimientos-${Date.now()}.${extension}`);
    res.send(buffer);
  }

  @Get('revenue')
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('format') format: 'csv' | 'excel' = 'excel',
    @Res() res: Response,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const buffer = await this.reportsService.generateRevenueReport(start, end, format);

    const extension = format === 'csv' ? 'csv' : 'xlsx';
    const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=ingresos-${Date.now()}.${extension}`);
    res.send(buffer);
  }

  @Get('abonos')
  async getAbonosReport(
    @Query('format') format: 'csv' | 'excel' = 'excel',
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateAbonosReport(format);

    const extension = format === 'csv' ? 'csv' : 'xlsx';
    const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=abonos-${Date.now()}.${extension}`);
    res.send(buffer);
  }
}

