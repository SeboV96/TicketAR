import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async create(createConfigDto: CreateConfigDto) {
    return this.prisma.config.create({
      data: createConfigDto,
    });
  }

  async findAll() {
    return this.prisma.config.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async findOne(key: string) {
    const config = await this.prisma.config.findUnique({
      where: { key },
    });

    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }

    return config;
  }

  async update(key: string, updateConfigDto: UpdateConfigDto) {
    await this.findOne(key);
    return this.prisma.config.update({
      where: { key },
      data: updateConfigDto,
    });
  }

  async remove(key: string) {
    await this.findOne(key);
    return this.prisma.config.delete({
      where: { key },
    });
  }
}

