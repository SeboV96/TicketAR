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
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('config')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.configService.create(createConfigDto);
  }

  @Get()
  findAll() {
    return this.configService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.configService.findOne(key);
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.update(key, updateConfigDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.configService.remove(key);
  }
}

