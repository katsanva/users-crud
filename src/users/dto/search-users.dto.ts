import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class SearchUsersDto extends PickType(UpdateUserDto, [
  'firstName',
  'lastName',
  'city',
]) {
  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional({
    type: 'number',
    minimum: 10,
    maximum: 1000,
  })
  limit: number;
  @ApiPropertyOptional({
    type: 'number',
    minimum: 0,
  })
  offset: number;
}
