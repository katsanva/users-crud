import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const USERS = '/users';
const USER = '/users/:id';

@Controller()
export class UsersController {
  constructor(private users: UsersService) {}

  @Post(USERS)
  create(@Body() payload: CreateUserDto): Promise<UserDto> {
    return this.users.create(payload);
  }

  @Get(USERS)
  list(): Promise<UserDto[]> {
    return this.users.list();
  }

  @Get(USER)
  get(@Param('id') id: string): Promise<UserDto> {
    return this.users.get(id);
  }

  @Patch(USER)
  update(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<UserDto> {
    return this.users.update(id, payload);
  }

  @Delete(USER)
  async remove(@Param('id') id: string): Promise<void> {
    await this.users.remove(id);
  }
}
