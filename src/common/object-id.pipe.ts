import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (value.length !== 24) {
      throw new NotFoundException();
    }

    try {
      return new ObjectId(value);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
