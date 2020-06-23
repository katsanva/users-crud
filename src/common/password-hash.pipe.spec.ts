import { PasswordHashPipe } from './password-hash.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ArgumentMetadata } from '@nestjs/common';

describe('PasswordHashPipe', () => {
  it('should be defined', () => {
    expect(new PasswordHashPipe()).toBeDefined();
  });

  it('should hash pasword', async () => {
    const value = { password: 'foo' } as CreateUserDto;

    const result = await new PasswordHashPipe().transform(
      value,
      ({} as unknown) as ArgumentMetadata,
    );

    expect(result.password).not.toEqual(value.password);
  });
});
