import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  private repository: Repository<Report>;

  constructor(@InjectRepository(Report) repository: Repository<Report>) {
    this.repository = repository;
  }

  create(dto: CreateReportDto, user: User) {
    const instance = this.repository.create(dto);
    instance.user = user;
    return this.repository.save(instance);
  }
}
