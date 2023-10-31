import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository} from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private repository: Repository<Category>
  ) {}

  create(data: CreateCategoryDto) {
    return this.repository.save(data);
  }

  findAll() {
    return this.repository.find({relations: ['records']});
  }

  findOne(id: number) {
    return this.repository.findOne({relations: ['records'], where: {id}});
  }

  update(id: number, data: UpdateCategoryDto) {
    return this.repository.save({ ...data, id });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
