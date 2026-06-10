import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type';

export function Serialize(type: ClassConstructor<any>) {
  return UseInterceptors(new SerializeInterceptor(type));
}

// https://rxjs.dev/guide/overview
export class SerializeInterceptor implements NestInterceptor {
  private type: ClassConstructor<any>;

  constructor(type: ClassConstructor<any>) {
    this.type = type;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler
    console.log('Im running before the handler');

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        console.log('Im running before response is sent out', data);
        return plainToInstance(this.type, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}