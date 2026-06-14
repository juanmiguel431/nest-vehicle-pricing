import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../auth/docorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';

@Controller('reports')
export class ReportsController {
  private reportsService: ReportsService;

  constructor(reportService: ReportsService) {
    this.reportsService = reportService;
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  create(
    @CurrentUser() user: User,
    @Body() body: CreateReportDto
  ) {
    return this.reportsService.create(body, user);
  }
}
