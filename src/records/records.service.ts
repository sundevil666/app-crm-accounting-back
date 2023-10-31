import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private repository: Repository<Record>
  ) {}

  create(data: CreateRecordDto) {
    return this.repository.save(data);
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [results, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      order: {
        id: 'DESC',
      },
    });

    return { results, total };
  }

  findOne(id: number) {
    return this.repository.findOneBy({id});
  }

  update(id: number, data: UpdateRecordDto) {
    return this.repository.save({ ...data, id });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
