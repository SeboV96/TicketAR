import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateMovementsReport(startDate: Date, endDate: Date, format: 'csv' | 'excel') {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        fechaIngreso: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        vehicle: true,
        rate: true,
        userIngreso: {
          select: {
            name: true,
          },
        },
        userSalida: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { fechaIngreso: 'desc' },
    });

    if (format === 'csv') {
      return this.generateCSV(tickets, 'movimientos');
    } else {
      return this.generateExcel(tickets, 'movimientos');
    }
  }

  async generateRevenueReport(startDate: Date, endDate: Date, format: 'csv' | 'excel') {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        fechaSalida: {
          gte: startDate,
          lte: endDate,
        },
        status: TicketStatus.FINALIZADO,
      },
      include: {
        vehicle: true,
        rate: true,
      },
      orderBy: { fechaSalida: 'desc' },
    });

    if (format === 'csv') {
      return this.generateCSV(tickets, 'ingresos');
    } else {
      return this.generateExcel(tickets, 'ingresos');
    }
  }

  async generateAbonosReport(format: 'csv' | 'excel') {
    const abonos = await this.prisma.abono.findMany({
      include: {
        vehicle: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        rate: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      return this.generateCSV(abonos, 'abonos');
    } else {
      return this.generateExcel(abonos, 'abonos');
    }
  }

  private async generateCSV(data: any[], type: string): Promise<Buffer> {
    const rows: string[] = [];
    
    if (type === 'movimientos' || type === 'ingresos') {
      rows.push('Patente,Tipo Vehículo,Fecha Ingreso,Fecha Salida,Horas,Minutos,Monto,Operador Ingreso,Operador Salida');
      data.forEach(item => {
        rows.push([
          item.patente || item.vehicle?.patente || '',
          item.tipoVehiculo || item.vehicle?.tipo || '',
          item.fechaIngreso ? dayjs(item.fechaIngreso).format('YYYY-MM-DD HH:mm:ss') : '',
          item.fechaSalida ? dayjs(item.fechaSalida).format('YYYY-MM-DD HH:mm:ss') : '',
          item.horas || '',
          item.minutos || '',
          item.monto || '0',
          item.userIngreso?.name || '',
          item.userSalida?.name || '',
        ].join(','));
      });
    } else {
      rows.push('Patente,Tipo Vehículo,Fecha Inicio,Fecha Fin,Precio,Usuario');
      data.forEach(item => {
        rows.push([
          item.vehicle?.patente || '',
          item.vehicle?.tipo || '',
          dayjs(item.fechaInicio).format('YYYY-MM-DD'),
          dayjs(item.fechaFin).format('YYYY-MM-DD'),
          item.precio || '0',
          item.user?.name || '',
        ].join(','));
      });
    }

    return Buffer.from(rows.join('\n'), 'utf-8');
  }

  private async generateExcel(data: any[], type: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    if (type === 'movimientos' || type === 'ingresos') {
      worksheet.columns = [
        { header: 'Patente', key: 'patente', width: 15 },
        { header: 'Tipo Vehículo', key: 'tipoVehiculo', width: 15 },
        { header: 'Fecha Ingreso', key: 'fechaIngreso', width: 20 },
        { header: 'Fecha Salida', key: 'fechaSalida', width: 20 },
        { header: 'Horas', key: 'horas', width: 10 },
        { header: 'Minutos', key: 'minutos', width: 10 },
        { header: 'Monto', key: 'monto', width: 15 },
        { header: 'Operador Ingreso', key: 'operadorIngreso', width: 20 },
        { header: 'Operador Salida', key: 'operadorSalida', width: 20 },
      ];

      data.forEach(item => {
        worksheet.addRow({
          patente: item.patente || item.vehicle?.patente || '',
          tipoVehiculo: item.tipoVehiculo || item.vehicle?.tipo || '',
          fechaIngreso: item.fechaIngreso ? dayjs(item.fechaIngreso).format('YYYY-MM-DD HH:mm:ss') : '',
          fechaSalida: item.fechaSalida ? dayjs(item.fechaSalida).format('YYYY-MM-DD HH:mm:ss') : '',
          horas: item.horas || 0,
          minutos: item.minutos || 0,
          monto: item.monto || 0,
          operadorIngreso: item.userIngreso?.name || '',
          operadorSalida: item.userSalida?.name || '',
        });
      });
    } else {
      worksheet.columns = [
        { header: 'Patente', key: 'patente', width: 15 },
        { header: 'Tipo Vehículo', key: 'tipoVehiculo', width: 15 },
        { header: 'Fecha Inicio', key: 'fechaInicio', width: 15 },
        { header: 'Fecha Fin', key: 'fechaFin', width: 15 },
        { header: 'Precio', key: 'precio', width: 15 },
        { header: 'Usuario', key: 'usuario', width: 20 },
      ];

      data.forEach(item => {
        worksheet.addRow({
          patente: item.vehicle?.patente || '',
          tipoVehiculo: item.vehicle?.tipo || '',
          fechaInicio: dayjs(item.fechaInicio).format('YYYY-MM-DD'),
          fechaFin: dayjs(item.fechaFin).format('YYYY-MM-DD'),
          precio: item.precio || 0,
          usuario: item.user?.name || '',
        });
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
