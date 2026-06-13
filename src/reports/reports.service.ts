import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  private repository: Repository<Report>;

  constructor(@InjectRepository(Report) repository: Repository<Report>) {
    this.repository = repository;
  }

  create(dto: CreateReportDto) {
    const instance = this.repository.create(dto);
    return this.repository.save(instance);
  }
}
