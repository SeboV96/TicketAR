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
import { AbonosService } from './abonos.service';
import { CreateAbonoDto } from './dto/create-abono.dto';
import { UpdateAbonoDto } from './dto/update-abono.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('abonos')
@UseGuards(JwtAuthGuard)
export class AbonosController {
  constructor(private readonly abonosService: AbonosService) {}

  @Post()
  create(@Body() createAbonoDto: CreateAbonoDto) {
    return this.abonosService.create(createAbonoDto);
  }

  @Get()
  findAll() {
    return this.abonosService.findAll();
  }

  @Get('active')
  findActive() {
    return this.abonosService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abonosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAbonoDto: UpdateAbonoDto) {
    return this.abonosService.update(id, updateAbonoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.abonosService.remove(id);
  }
}

