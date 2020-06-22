import {
  PipeTransform,
  ArgumentMetadata,
  Type,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import * as Ajv from 'ajv';

export class SwaggerValidatorPipe implements PipeTransform {
  private validators: Map<string, any> = new Map();
  private static ajv = new Ajv();

  constructor(private readonly document: OpenAPIObject) {
    if (!document.components || !document.components.schemas) {
      return;
    }
  }

  private getValidator({ name }: Type<any>) {
    if (!this.validators.has(name)) {
      try {
        const schema =
          this.document.components &&
          this.document.components.schemas &&
          this.document.components.schemas[name];

        if (!schema) {
          this.validators.set(name, false);
        }

        this.validators.set(name, SwaggerValidatorPipe.ajv.compile(schema));
      } catch (e) {
        this.validators.set(name, false);
      }
    }

    return this.validators.get(name);
  }

  transform<T>(value: T, metadata: ArgumentMetadata): T {
    if (!metadata.metatype || metadata.type === 'custom') {
      return value;
    }

    const validationFn = this.getValidator(metadata.metatype);

    if (validationFn && !validationFn(value)) {
      throw new UnprocessableEntityException(
        `${metadata.metatype.name} validation failed`,
        validationFn.errors,
      );
    }

    return value;
  }
}
