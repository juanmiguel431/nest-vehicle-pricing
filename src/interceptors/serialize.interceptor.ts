import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance, ClassConstructor } from 'class-transformer';

export function Serialize<T>(type: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(type));
}

// https://rxjs.dev/guide/overview
export class SerializeInterceptor<T> implements NestInterceptor {
  private readonly type: ClassConstructor<T>;

  constructor(type: ClassConstructor<T>) {
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