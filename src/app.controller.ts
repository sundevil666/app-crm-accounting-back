import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserDtoSchema,
} from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { ZodValidationPipe } from './pipies/ZodValidationPipe';

@Controller('api')
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(CreateUserDtoSchema))
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
