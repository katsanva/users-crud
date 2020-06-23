import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import * as faker from 'faker';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SearchUsersDto } from '../src/users/dto/search-users.dto';
import { SwaggerValidatorPipe } from '../src/common/swagger-validator.pipe';
import { USERS } from '../src/routes';

import { CreateUserDto } from '../src/users/dto/create-user.dto';

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
  });
});
