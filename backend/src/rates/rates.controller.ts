import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RatesService } from './rates.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('rates')
@UseGuards(JwtAuthGuard)
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  findAll() {
    // Todos los usuarios autenticados pueden ver tarifas
    return this.ratesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Todos los usuarios autenticados pueden ver una tarifa
    return this.ratesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createRateDto: CreateRateDto) {
    return this.ratesService.create(createRateDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateRateDto: UpdateRateDto) {
    return this.ratesService.update(id, updateRateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.ratesService.remove(id);
  }
}

