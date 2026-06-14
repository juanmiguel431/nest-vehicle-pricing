import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware<Request, Response> {
  private userService: UsersService;

  constructor(userService: UsersService) {
    this.userService = userService;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    const { userId } = req.session || {};

    if (userId) {
      // @ts-ignore
      req.currentUser = await this.userService.findById(userId);
    }

    next();
  }
}