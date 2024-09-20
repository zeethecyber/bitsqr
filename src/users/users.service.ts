import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const password = bcrypt.hashSync(createUserDto.password, 10);
      const user = await this.database.user.create({
        data: {
          ...createUserDto,
          password: password,
        },
      });
      return user;
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    const users = await this.database.user.findMany();
    if (!users.length) {
      return 'No users found';
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.database.user.findUnique({
      where: { id },
    });
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let password: string;
    if (updateUserDto.password)
      password = bcrypt.hashSync(String(updateUserDto.password), 10);
    const user = await this.database.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: password,
      },
    });
    if (!user) {
      return 'User not found';
    }
    return user;
  }

  async remove(id: number) {
    try {
      const user = await this.database.user.delete({
        where: { id },
      });
      if (!user) {
        return 'User not found';
      }
      return user;
    } catch (error) {
      return error;
    }
  }
}
