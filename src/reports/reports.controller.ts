import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('reports')
export class ReportsController {
  private reportsService: ReportsService;

  constructor(reportService: ReportsService) {
    this.reportsService = reportService;
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: CreateReportDto) {

    return this.reportsService.create(body);

  }
}
