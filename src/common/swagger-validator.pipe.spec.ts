import { SwaggerValidatorPipe } from './swagger-validator.pipe';
import { ArgumentMetadata } from '@nestjs/common';

describe('SwaggerValidatorPipe', () => {
  describe('#validate()', () => {
    it('should bypass validation for non-existing schema', () => {
      const pipe = new SwaggerValidatorPipe({
        openapi: '',
        info: { title: '', version: '' },
        paths: {},
      });

      const value = {};
      const metadata: ArgumentMetadata = {
        metatype: class SomeType {},
        type: 'body',
      };

      const result = pipe.transform(value, metadata);

      expect(result).toBe(value);
    });

    it('should bypass valid object', () => {
      const pipe = new SwaggerValidatorPipe({
        openapi: '',
        info: { title: '', version: '' },
        paths: {},
        components: {
          schemas: {
            SomeType: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  maxLength: 5,
                },
                bla: {
                  type: 'string',
                },
              },
              required: ['foo'],
            },
          },
        },
      });

      const value = { foo: '1234' };
      const metadata: ArgumentMetadata = {
        metatype: class SomeType {},
        type: 'body',
      };

      const result = pipe.transform(value, metadata);

      expect(result).toBe(value);
    });

    it('should throw error on invalid value provided', () => {
      const pipe = new SwaggerValidatorPipe({
        openapi: '',
        info: { title: '', version: '' },
        paths: {},
        components: {
          schemas: {
            SomeType: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  maxLength: 5,
                },
                bla: {
                  type: 'string',
                },
              },
              required: ['foo'],
            },
          },
        },
      });

      const value = { foo: '123456' };
      const metadata: ArgumentMetadata = {
        metatype: class SomeType {},
        type: 'body',
      };

      expect(() => pipe.transform(value, metadata)).toThrow(
        'SomeType validation failed',
      );
    });
  });
});
