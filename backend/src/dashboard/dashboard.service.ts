import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfDay = dayjs(now).startOf('day').toDate();
    const startOfWeek = dayjs(now).startOf('week').toDate();
    const startOfMonth = dayjs(now).startOf('month').toDate();

    const [
      activeTickets,
      totalSpaces,
      todayTickets,
      todayRevenue,
      weekRevenue,
      monthRevenue,
    ] = await Promise.all([
      this.prisma.ticket.count({
        where: { status: TicketStatus.ACTIVO },
      }),
      this.getMaxParkingSpaces(),
      this.prisma.ticket.count({
        where: {
          fechaIngreso: { gte: startOfDay },
        },
      }),
      this.prisma.ticket.aggregate({
        where: {
          fechaSalida: { gte: startOfDay },
          status: TicketStatus.FINALIZADO,
        },
        _sum: { monto: true },
      }),
      this.prisma.ticket.aggregate({
        where: {
          fechaSalida: { gte: startOfWeek },
          status: TicketStatus.FINALIZADO,
        },
        _sum: { monto: true },
      }),
      this.prisma.ticket.aggregate({
        where: {
          fechaSalida: { gte: startOfMonth },
          status: TicketStatus.FINALIZADO,
        },
        _sum: { monto: true },
      }),
    ]);

    const occupancy = totalSpaces > 0 ? (activeTickets / totalSpaces) * 100 : 0;

    return {
      occupancy: {
        current: activeTickets,
        total: totalSpaces,
        percentage: Math.round(occupancy),
      },
      today: {
        tickets: todayTickets,
        revenue: todayRevenue._sum.monto || 0,
      },
      week: {
        revenue: weekRevenue._sum.monto || 0,
      },
      month: {
        revenue: monthRevenue._sum.monto || 0,
      },
    };
  }

  async getRecentTickets(limit = 10) {
    return this.prisma.ticket.findMany({
      take: limit,
      include: {
        vehicle: true,
        userIngreso: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async getMaxParkingSpaces(): Promise<number> {
    const config = await this.prisma.config.findUnique({
      where: { key: 'MAX_PARKING_SPACES' },
    });

    return config ? parseInt(config.value) : parseInt(process.env.MAX_PARKING_SPACES || '100');
  }
}

