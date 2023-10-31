import * as bcrypt from 'bcrypt'
import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const saltOrRound = 10;
      data.password = await bcrypt.hash(data.password, saltOrRound);
      const user = await this.repository.save(data);

      const res = {
        id: user.id,
        ...this.generateToken(user),
      }
      return res;
    } catch {
      throw new BadRequestException(
        'User with this email is already in the system'
      );
    }
  }

  private generateToken(user: User) {
    const payload = { email: user.email, id: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({id});
  }
  findOneByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  update(id: number, data: UpdateUserDto) {
    return this.repository.save({ ...data, id });
  }

  async updateAvatar(userId: number, newAvatar: string): Promise<any> {
    return this.repository.update(userId, { avatar: newAvatar });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }

}
