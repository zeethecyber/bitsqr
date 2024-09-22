import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    const users = await this.database.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
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
    const user = await this.database.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        role: updateUserDto.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return user;
  }

  async remove(id: number) {
    const user = await this.database.user.delete({
      where: { id },
    });
    if (!user) {
      return 'User not found';
    }
    return {
      message: 'User deleted successfully',
    };
  }
}
