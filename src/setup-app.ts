import { INestApplication, ValidationPipe } from '@nestjs/common';
import session from 'express-session';

export const setupApp = (app: INestApplication) => {
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );
};
