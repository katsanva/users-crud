import { Controller, Get, Post, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

const USERS = '/users';
const USER = '/users/:id';

@Controller()
export class UsersController {
  constructor(private users: UsersService) {}

  @Post(USERS)
  create() {
    return this.users.create();
  }

  @Get(USERS)
  list() {
    return this.users.list();
  }

  @Get(USER)
  get() {
    return this.users.get();
  }

  @Patch(USER)
  update() {
    return this.users.update();
  }

  @Delete(USER)
  remove() {
    return this.users.remove();
  }
}
