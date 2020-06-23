import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseFilters,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoErrorFilter } from '../common/mongo-error.filter';
import { SearchUsersDto } from './dto/search-users.dto';
import { USERS, USER } from '../routes';
import { ObjectIdPipe } from '../common/object-id.pipe';
import { ObjectId } from 'mongodb';
import { PasswordHashPipe } from '../common/password-hash.pipe';

@Controller()
@UseFilters(MongoErrorFilter)
export class UsersController {
  constructor(private users: UsersService) {}

  @Post(USERS)
  create(@Body(PasswordHashPipe) payload: CreateUserDto): Promise<UserDto> {
    return this.users.create(payload);
  }

  @Get(USERS)
  list(@Query() query: SearchUsersDto): Promise<UserDto[]> {
    return this.users.list(query);
  }

  @Get(USER)
  get(@Param('id', ObjectIdPipe) id: ObjectId): Promise<UserDto> {
    return this.users.get(id);
  }

  @Patch(USER)
  update(
    @Param('id', ObjectIdPipe) id: ObjectId,
    @Body() payload: UpdateUserDto,
  ): Promise<UserDto> {
    return this.users.update(id, payload);
  }

  @Delete(USER)
  async remove(@Param('id', ObjectIdPipe) id: ObjectId): Promise<void> {
    await this.users.remove(id);
  }
}
