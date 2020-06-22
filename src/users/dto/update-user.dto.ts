import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    format: 'email',
  })
  email: string;

  @ApiPropertyOptional({
    minLength: 1,
    maxLength: 25,
  })
  firstName: string;

  @ApiPropertyOptional({
    minLength: 8,
    maxLength: 8,
  })
  password: string;

  @ApiPropertyOptional({
    minLength: 1,
    maxLength: 25,
  })
  lastName: string;

  @ApiPropertyOptional({
    minLength: 1,
    maxLength: 25,
  })
  city: string;
}
