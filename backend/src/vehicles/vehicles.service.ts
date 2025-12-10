import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const numeroPatente = createVehicleDto.numeroPatente.toString();
    
    // Buscar todos los vehículos con el mismo número de patente (terminan con -numero)
    const existingVehicles = await this.prisma.vehicle.findMany({
      where: {
        patente: {
          endsWith: '-' + numeroPatente,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Determinar el número de secuencia
    let secuencia = 1;
    if (existingVehicles.length > 0) {
      // Extraer el número de secuencia más alto
      const secuencias = existingVehicles
        .map(v => {
          // La patente tiene formato "secuencia-numero"
          const match = v.patente.match(/^(\d+)-/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter(n => n > 0);
      
      if (secuencias.length > 0) {
        secuencia = Math.max(...secuencias) + 1;
      }
    }

    // Generar patente con formato: "secuencia-numero"
    const patente = `${secuencia}-${numeroPatente}`;

    // Verificar que no exista (por si acaso)
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { patente },
    });

    if (existingVehicle) {
      throw new ConflictException('La patente ya está registrada');
    }

    return this.prisma.vehicle.create({
      data: {
        patente,
        tipo: createVehicleDto.tipo,
      },
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

  async findByNumeroPatente(numeroPatente: number) {
    const numeroStr = numeroPatente.toString();
    // Buscar todos los vehículos con ese número de patente
    const vehicles = await this.prisma.vehicle.findMany({
      where: {
        patente: {
          endsWith: '-' + numeroStr,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (vehicles.length === 0) {
      return null;
    }

    // Retornar el más reciente (mayor secuencia)
    // Ordenar por secuencia (extraer número antes del guión)
    const sorted = vehicles.sort((a, b) => {
      const seqA = parseInt(a.patente.split('-')[0]) || 0;
      const seqB = parseInt(b.patente.split('-')[0]) || 0;
      return seqB - seqA; // Mayor secuencia primero
    });

    return sorted[0];
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

