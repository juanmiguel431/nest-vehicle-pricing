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
    // setupApp(app);
    await app.init();
  });

  it('handles a signup request', () => {
    const body = new CreateUserDto();
    body.email = 'test1@test.com';
    body.password = 'test1';

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

  it('signup as a new user then get the currently logged in user', async () => {
    const payload = new CreateUserDto();
    payload.email = 'test2@test.com';
    payload.password = 'test2';

    const response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(payload)
      .expect(HttpStatus.CREATED);

    const cookie = response.get('Set-Cookie')!;

    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    expect(body.email).toEqual(payload.email);
  });

  afterEach(async () => {
    await app.close();
  });
});
