import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private repository: Repository<Record>
  ) {}

  private readonly logger = new Logger(RecordsService.name);

  async create(data: CreateRecordDto) {
    this.logger.log(`Received data to save: ${JSON.stringify(data)}`);
    const savedRecord = await this.repository.save(data); // Добавьте ключевое слово await
    this.logger.log(`Saved record: ${JSON.stringify(savedRecord)}`);
    return savedRecord;
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
    return this.repository.findOneBy({ id });
  }

  update(id: number, data: UpdateRecordDto) {
    return this.repository.save({ ...data, id });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
