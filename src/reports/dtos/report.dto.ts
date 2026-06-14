import { Report } from '../report.entity';
import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  millage: number;

  @Transform((data) => data.obj.user.id)
  @Expose()
  userId: number;

  @Expose()
  approved: boolean;

  public static fromReport(report: Report) {
    const dto = new ReportDto();
    dto.id = report.id;
    dto.price = report.price;
    dto.make = report.make;
    dto.model = report.model;
    dto.year = report.year;
    dto.lng = report.lng;
    dto.lat = report.lat;
    dto.millage = report.millage;
    dto.userId = report.userId;
    dto.approved = report.approved;

    return dto;
  }
}