import BaseModel from '@database/models/base.model';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ModelOmitInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (data instanceof BaseModel) {
          return data.jsonOmitted ? data : data.omitFromJson();
        }

        return data;
      }),
    );
  }
}
