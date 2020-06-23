import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({
    format: 'email',
  })
  email: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 25,
  })
  firstName: string;

  @ApiProperty({
    pattern: '^(?=.*[A-Z])([A-z\\d]{8})$',
  })
  password: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 25,
  })
  lastName: string;

  @ApiPropertyOptional({
    minLength: 1,
    maxLength: 25,
  })
  city?: string;
}
