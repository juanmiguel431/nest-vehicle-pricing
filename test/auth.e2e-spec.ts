import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dtos/create-user.dto';
import { setupApp } from '../src/setup-app';

describe('Authentication System (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  it('handles a signup request', () => {
    const body = new CreateUserDto();
    body.email = 'juanmiguel4313@hotmail.com';
    body.password = 'juanmiguel431';

    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(body)
      .expect(HttpStatus.CREATED)
      .then(res => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(body.email);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
