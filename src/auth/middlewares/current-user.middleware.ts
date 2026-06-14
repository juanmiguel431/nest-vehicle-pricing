import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
      userId?: number;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware<Request, Response> {
  private userService: UsersService;

  constructor(userService: UsersService) {
    this.userService = userService;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      req.currentUser = await this.userService.findById(userId);
    }

    next();
  }
}