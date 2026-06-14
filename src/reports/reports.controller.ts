import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../auth/docorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';

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

  @Patch(':id')
  @UseGuards(AdminGuard)
  @Serialize(ReportDto)
  @HttpCode(HttpStatus.OK)
  async approveReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveReportDto
  ) {
    try {
      return await this.reportsService.changeApproval(id, body.approved);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
