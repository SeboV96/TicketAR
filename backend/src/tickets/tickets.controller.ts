import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ExitTicketDto } from './dto/exit-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('entry')
  create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    return this.ticketsService.create({
      ...createTicketDto,
      operadorId: req.user.userId,
    });
  }

  @Post('exit')
  exit(@Body() exitTicketDto: ExitTicketDto, @Request() req) {
    return this.ticketsService.exit({
      ...exitTicketDto,
      operadorId: req.user.userId,
    });
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.ticketsService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }
}

