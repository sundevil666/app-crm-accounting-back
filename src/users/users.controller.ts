import {
  Controller, Get, Body, Patch, Param, Delete, UseGuards, UsePipes, Post, UploadedFile, UseInterceptors, Req, UnauthorizedException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateUserDtoSchema } from "./dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ZodValidationPipe } from "../pipies/ZodValidationPipe";
import { FileInterceptor } from "@nestjs/platform-express";
import * as crypto from 'crypto';
import * as fs from 'fs';
import { extname } from 'path';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';
import * as process from 'process';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async findOne(@Req() req): Promise<UserDto> {
    const userId = this.getUserIdFromToken(req);
    const user = await this.usersService.findOne(userId);

    const userDto: UserDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };

    return userDto;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateUserDtoSchema))
  update(@Param('') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update(+id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      return 'File is not uploaded. Please try again li';
    }
    const userId = this.getUserIdFromToken(req);
    const uploadPath = `./upload/${userId}`;
    const newFileName = this.generateNewFileName(file.originalname);

    this.createUploadDirectory(uploadPath);

    if (!this.isSupportedFileType(file.mimetype)) {
      this.deleteUploadedFile(file.path);
      return 'Данный тип файла не поддерживается. Поддерживаются только изображения.';
    }

    this.saveFile(newFileName, file.buffer, uploadPath);

    // Получите текущего пользователя
    const user = await this.usersService.findOne(userId);

    if (user) {
      // Если у пользователя уже есть аватар, удалите старый файл
      if (user.avatar) {
        const fileName = user.avatar.substring(user.avatar.lastIndexOf('/') + 1);
        const filePath = `./upload/${userId}/${fileName}`;
        this.deleteUploadedFile(`./upload/${userId}/${fileName}`);
      }

      const baseUrl = process.env.BASE_URL
      user.avatar = baseUrl + `${userId}/${newFileName}`;
      await this.usersService.update(user.id, user);

      return 'Avatar is updated';
    } else {
      return 'Avatar is not updated';
    }
  }

  private createUploadDirectory(uploadPath: string) {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  private deleteUploadedFile(filePath: string) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
    }
  }

  private saveFile(fileName: string, fileBuffer: Buffer, uploadPath: string) {
    const newFilePath = `${uploadPath}/${fileName}`;
    fs.writeFileSync(newFilePath, fileBuffer);
  }

  private generateNewFileName(originalName: string): string {
    const fileExtension = extname(originalName);
    const fileHash = crypto.randomBytes(3).toString('hex');
    const fileNameWithoutExtension = originalName.replace(fileExtension, '');
    return `${fileNameWithoutExtension}---${fileHash}${fileExtension}`;
  }

  private isSupportedFileType(mimeType: string | undefined): boolean {
    const supportedTypes = ['image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp', 'image/png'];
    return mimeType && supportedTypes.includes(mimeType);
  }

  private getUserIdFromToken(req): number {
    const token = req.headers.authorization;
    const tokenParts = token.split(' ');
    const jwtToken = tokenParts[1];

    const decodedToken = this.jwtService.decode(jwtToken);

    if (decodedToken) {
      return (decodedToken as { id: number }).id;
    } else {
      throw new UnauthorizedException('Token is not valid');
    }
  }
}
