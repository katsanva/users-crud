import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  create(body: CreateUserDto): Promise<User> {
    const user = new this.model(body);

    return user.save();
  }

  list(): Promise<User[]> {
    return this.model.find().exec();
  }

  get(id: string): Promise<User> {
    return this.model.findById(id).exec();
  }

  update(_id: string, payload: UpdateUserDto): Promise<User> {
    return this.model.findOneAndUpdate({ _id }, payload).exec();
  }

  remove(id: string): Promise<User> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
