import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../users/user.entity';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { currentUser }: { currentUser: User } = request;

    // console.log(currentUser);

    return currentUser?.isAdmin ?? false;
  }
}