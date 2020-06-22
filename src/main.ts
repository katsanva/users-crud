import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as config from 'config';
import { SwaggerValidatorPipe } from './common/swagger-validator.pipe';

const { version } = require('../package.json');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('The users API description')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new SwaggerValidatorPipe(document));

  await app.listen(config.get('app.port'));
}
bootstrap();
