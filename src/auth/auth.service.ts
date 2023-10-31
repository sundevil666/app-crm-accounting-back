import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from "../users/entities/user.entity";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare( password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const res = {
      id: user.id,
      ...this.generateToken(user),
    }
    return res;
  }

  private generateToken(user: User) {
    const payload = { email: user.email, id: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
