import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import * as faker from 'faker';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SearchUsersDto } from '../src/users/dto/search-users.dto';
import { SwaggerValidatorPipe } from '../src/common/swagger-validator.pipe';
import { USERS, USER } from '../src/routes';

import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';

const constructUserRoute = (id: string) => USER.replace(':id', id);

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const options = new DocumentBuilder().build();
    const document = SwaggerModule.createDocument(app, options, {
      extraModels: [SearchUsersDto],
    });

    SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(new SwaggerValidatorPipe(document));
    await app.init();
  });

  describe(`${USERS} (POST)`, () => {
    it('should respond 201 on user creation', () => {
      const payload: CreateUserDto = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(7) + 'D',
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      return request(app.getHttpServer())
        .post(USERS)
        .send(payload)
        .expect(HttpStatus.CREATED);
    });

    it('should validate input', () => {
      const payload: CreateUserDto = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(7),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      return request(app.getHttpServer())
        .post(USERS)
        .send(payload)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should not allow to use same email', async () => {
      const payload: CreateUserDto = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(7) + 'D',
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      await request(app.getHttpServer())
        .post(USERS)
        .send(payload)
        .expect(HttpStatus.CREATED);

      return request(app.getHttpServer())
        .post(USERS)
        .send(payload)
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe(`${USER} (GET)`, () => {
    let user: UserDto;

    beforeAll(async () => {
      const payload: CreateUserDto = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(7) + 'D',
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const res = await request(app.getHttpServer())
        .post(USERS)
        .send(payload);

      user = res.body;
    });

    it('should return 404 for random id', () => {
      return request(app.getHttpServer())
        .get(constructUserRoute(faker.random.alphaNumeric(5)))
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 200 on valid id', () => {
      return request(app.getHttpServer())
        .get(constructUserRoute(user._id))
        .expect(HttpStatus.OK, user);
    });
  });

  describe(`${USER} (PATCH)`, () => {
    let user: UserDto;

    beforeAll(async () => {
      const payload: CreateUserDto = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(7) + 'D',
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const res = await request(app.getHttpServer())
        .post(USERS)
        .send(payload);

      user = res.body;
    });

    it('should return 404 for random id', () => {
      return request(app.getHttpServer())
        .patch(constructUserRoute(faker.random.alphaNumeric(5)))
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 200 on valid id', () => {
      return request(app.getHttpServer())
        .patch(constructUserRoute(user._id))
        .send({ firstName: 'foo' })
        .expect(HttpStatus.OK, { ...user, firstName: 'foo' });
    });

    it('should validate input', () => {
      return request(app.getHttpServer())
        .patch(constructUserRoute(user._id))
        .send({ password: 'foo' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });
});
