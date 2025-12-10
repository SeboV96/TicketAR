import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { patente: createVehicleDto.patente },
    });

    if (existingVehicle) {
      throw new ConflictException('La patente ya está registrada');
    }

    return this.prisma.vehicle.create({
      data: createVehicleDto,
    });
  }

  async findAll() {
    return this.prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return vehicle;
  }

  async findByPatente(patente: string) {
    return this.prisma.vehicle.findUnique({
      where: { patente },
    });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id);
    return this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}

