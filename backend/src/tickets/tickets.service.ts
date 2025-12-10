import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { RatesService } from '../rates/rates.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ExitTicketDto } from './dto/exit-ticket.dto';
import { TicketStatus, RateType } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private vehiclesService: VehiclesService,
    private ratesService: RatesService,
    private realtimeGateway: RealtimeGateway,
  ) {}

  async create(createTicketDto: CreateTicketDto & { operadorId: string }) {
    // Verificar si el vehículo ya está dentro
    const activeTicket = await this.prisma.ticket.findFirst({
      where: {
        vehicleId: createTicketDto.vehicleId,
        status: TicketStatus.ACTIVO,
      },
    });

    if (activeTicket) {
      throw new BadRequestException('El vehículo ya tiene un ticket activo');
    }

    const vehicle = await this.vehiclesService.findOne(createTicketDto.vehicleId);
    const fechaIngreso = new Date();

    const ticket = await this.prisma.ticket.create({
      data: {
        vehicleId: createTicketDto.vehicleId,
        patente: vehicle.patente,
        tipoVehiculo: vehicle.tipo,
        fechaIngreso,
        operadorIngreso: createTicketDto.operadorId,
        status: TicketStatus.ACTIVO,
      },
      include: {
        vehicle: true,
        userIngreso: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Notificar cambio en tiempo real
    this.realtimeGateway.notifyParkingUpdate();
    this.realtimeGateway.notifyTicketCreated(ticket);

    return ticket;
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      include: {
        vehicle: true,
        rate: true,
        userIngreso: {
          select: {
            id: true,
            name: true,
          },
        },
        userSalida: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.ticket.findMany({
      where: { status: TicketStatus.ACTIVO },
      include: {
        vehicle: true,
        userIngreso: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { fechaIngreso: 'desc' },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        vehicle: true,
        rate: true,
        userIngreso: {
          select: {
            id: true,
            name: true,
          },
        },
        userSalida: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    return ticket;
  }

  async exit(exitTicketDto: ExitTicketDto & { operadorId: string }) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        vehicleId: exitTicketDto.vehicleId,
        status: TicketStatus.ACTIVO,
      },
      include: {
        vehicle: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('No se encontró un ticket activo para este vehículo');
    }

    const fechaSalida = new Date();
    const diffMs = fechaSalida.getTime() - ticket.fechaIngreso.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = diffMinutes / 60;

    // Verificar si tiene abono activo
    const abono = await this.prisma.abono.findFirst({
      where: {
        vehicleId: exitTicketDto.vehicleId,
        activo: true,
        fechaInicio: { lte: fechaSalida },
        fechaFin: { gte: fechaSalida },
      },
      include: { rate: true },
    });

    let monto = 0;
    let rateId = null;

    if (abono) {
      // Usar tarifa del abono
      monto = 0; // Abono ya pagado
      rateId = abono.rateId;
    } else {
      // Calcular tarifa según reglas
      const rate = await this.ratesService.findApplicableRate(ticket.fechaIngreso);
      
      if (!rate) {
        throw new BadRequestException('No se encontró una tarifa aplicable');
      }

      rateId = rate.id;
      monto = this.calculateAmount(rate, diffMinutes, diffHours);
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        fechaSalida,
        monto,
        horas: diffHours,
        minutos: diffMinutes,
        rateId,
        operadorSalida: exitTicketDto.operadorId,
        status: TicketStatus.FINALIZADO,
      },
      include: {
        vehicle: true,
        rate: true,
        userIngreso: {
          select: {
            id: true,
            name: true,
          },
        },
        userSalida: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Notificar cambio en tiempo real
    this.realtimeGateway.notifyParkingUpdate();
    this.realtimeGateway.notifyTicketExited(updatedTicket);

    return updatedTicket;
  }

  private calculateAmount(rate: any, minutes: number, hours: number): number {
    switch (rate.tipo) {
      case RateType.POR_HORA:
        // Calcular por horas completas (redondeo hacia arriba)
        return Math.ceil(hours) * rate.precio;

      case RateType.MENSUAL:
        // Los abonos mensuales ya están pagados
        return 0;

      default:
        // Por defecto, calcular por hora
        return Math.ceil(hours) * rate.precio;
    }
  }
}
