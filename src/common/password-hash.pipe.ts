import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { hash } from 'argon2';

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  async transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    return {
      ...value,
      password: await hash(value.password),
    };
  }
}
