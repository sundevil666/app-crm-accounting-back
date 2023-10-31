import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto, CreateRecordDtoSchema } from './dto/create-record.dto';
import { UpdateRecordDto, UpdateRecordDtoSchema } from './dto/update-record.dto';
import { AuthGuard } from "@nestjs/passport";
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ZodValidationPipe } from "../pipies/ZodValidationPipe";

@Controller('api/records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(new ZodValidationPipe(CreateRecordDtoSchema))
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.create(createRecordDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const { results, total } = await this.recordsService.findAll(page, limit);
    return { results, total };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.recordsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateRecordDtoSchema))
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(+id, updateRecordDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.recordsService.remove(+id);
  }
}
