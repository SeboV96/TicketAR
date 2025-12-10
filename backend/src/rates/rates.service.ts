import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

@Injectable()
export class RatesService {
  constructor(private prisma: PrismaService) {}

  async create(createRateDto: CreateRateDto) {
    return this.prisma.rate.create({
      data: createRateDto,
    });
  }

  async findAll() {
    return this.prisma.rate.findMany({
      where: { activo: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const rate = await this.prisma.rate.findUnique({
      where: { id },
    });

    if (!rate) {
      throw new NotFoundException('Tarifa no encontrada');
    }

    return rate;
  }

  async findApplicableRate(fecha: Date, tipoVehiculo?: string) {
    const diaSemana = fecha.getDay();
    const hora = fecha.getHours();

    const rates = await this.prisma.rate.findMany({
      where: {
        activo: true,
        AND: [
          {
            OR: [
              { diaSemana: null },
              { diaSemana },
            ],
          },
          {
            OR: [
              { horaInicio: null, horaFin: null },
              {
                AND: [
                  { horaInicio: { lte: hora } },
                  { horaFin: { gte: hora } },
                ],
              },
            ],
          },
        ],
      },
      orderBy: { precio: 'asc' },
    });

    return rates[0] || null;
  }

  async update(id: string, updateRateDto: UpdateRateDto) {
    await this.findOne(id);
    return this.prisma.rate.update({
      where: { id },
      data: updateRateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.rate.update({
      where: { id },
      data: { activo: false },
    });
  }
}

