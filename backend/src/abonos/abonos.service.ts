import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { RatesService } from '../rates/rates.service';
import { CreateAbonoDto } from './dto/create-abono.dto';
import { UpdateAbonoDto } from './dto/update-abono.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class AbonosService {
  constructor(
    private prisma: PrismaService,
    private vehiclesService: VehiclesService,
    private ratesService: RatesService,
  ) {}

  async create(createAbonoDto: CreateAbonoDto) {
    await this.vehiclesService.findOne(createAbonoDto.vehicleId);
    await this.ratesService.findOne(createAbonoDto.rateId);

    // Verificar que no haya solapamiento de fechas
    const existingAbono = await this.prisma.abono.findFirst({
      where: {
        vehicleId: createAbonoDto.vehicleId,
        activo: true,
        OR: [
          {
            AND: [
              { fechaInicio: { lte: createAbonoDto.fechaFin } },
              { fechaFin: { gte: createAbonoDto.fechaInicio } },
            ],
          },
        ],
      },
    });

    if (existingAbono) {
      throw new BadRequestException('Ya existe un abono activo para este vehículo en el período seleccionado');
    }

    return this.prisma.abono.create({
      data: createAbonoDto,
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rate: true,
      },
    });
  }

  async findAll() {
    return this.prisma.abono.findMany({
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rate: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    const now = new Date();
    return this.prisma.abono.findMany({
      where: {
        activo: true,
        fechaInicio: { lte: now },
        fechaFin: { gte: now },
      },
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rate: true,
      },
    });
  }

  async findOne(id: string) {
    const abono = await this.prisma.abono.findUnique({
      where: { id },
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rate: true,
      },
    });

    if (!abono) {
      throw new NotFoundException('Abono no encontrado');
    }

    return abono;
  }

  async update(id: string, updateAbonoDto: UpdateAbonoDto) {
    await this.findOne(id);
    return this.prisma.abono.update({
      where: { id },
      data: updateAbonoDto,
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rate: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.abono.update({
      where: { id },
      data: { activo: false },
    });
  }
}

