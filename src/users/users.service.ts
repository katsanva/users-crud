import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model, FilterQuery } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  create(body: CreateUserDto): Promise<User> {
    const user = new this.model(body);

    return user.save();
  }

  list(query: SearchUsersDto): Promise<User[]> {
    const { limit = 10, offset = 0 } = query;

    return this.model
      .find(this.buildSearchQuery(query))
      .limit(limit)
      .skip(offset)
      .exec();
  }

  private buildSearchQuery(query: SearchUsersDto): FilterQuery<User> {
    return ['email', 'city', 'firstName', 'lastName'].reduce((acc, val) => {
      if (!query[val]) {
        return acc;
      }

      return {
        ...acc,
        [val]: { $regex: query[val], $options: 'i' },
      };
    }, {});
  }

  get(id: ObjectId): Promise<User> {
    return this.model.findById(id).exec();
  }

  update(_id: ObjectId, payload: UpdateUserDto): Promise<User> {
    return this.model.findOneAndUpdate({ _id }, payload).exec();
  }

  remove(id: ObjectId): Promise<User> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
