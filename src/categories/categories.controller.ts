import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, CreateCategoryDtoSchema } from './dto/create-category.dto';
import { AuthGuard } from "@nestjs/passport";
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ZodValidationPipe } from "../pipies/ZodValidationPipe";

@Controller('api/categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(new ZodValidationPipe(CreateCategoryDtoSchema))
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.categoriesService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(CreateCategoryDtoSchema))
  update(@Param('id', ParseIntPipe) id: string, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.update(Number(id), createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.categoriesService.remove(+id);
  }
}
