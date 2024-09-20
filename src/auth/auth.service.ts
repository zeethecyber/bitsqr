import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    try {
      // Hash password
      const password = this.hashPassword(createAuthDto.password);
      // Create user
      const user = await this.dbService.user.create({
        data: { ...createAuthDto, password },
      });

      // Handle registration based on role
      switch (createAuthDto.role) {
        case 'vendor':
          await this.handleVendorRegistration({
            address: createAuthDto.address,
            userId: user.id,
          });
          break;
        case 'customer':
          this.handleCustomerRegistration();
          break;
        default:
          break;
      }
      // Return user
      delete user.password;
      return user;
    } catch (error) {
      return error;
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.dbService.user.findFirst({
      where: {
        email: loginAuthDto.email,
      },
    });
    if (!user) {
      return 'User not found';
    }
    if (!this.comparePassword(loginAuthDto.password, user.password)) {
      return 'Invalid password';
    }
    delete user.password;
    const token = this.jwtService.sign(user);
    return {
      user,
      token,
    };
  }

  async remove(id: number) {
    try {
      const user = await this.dbService.user.findFirst({
        where: {
          id,
        },
      });
      if (!user) {
        return 'User not found';
      }
      await this.dbService.user.delete({
        where: {
          id,
        },
      });
      if (user.role === 'vendor') {
        await this.dbService.vendor.delete({
          where: {
            userId: id,
          },
        });
      }
    } catch (error) {
      return error;
    }
  }

  private hashPassword(password: string) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }

  private comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  private handleVendorRegistration({
    address,
    userId,
  }: {
    address: string;
    userId: number;
  }) {
    return this.dbService.vendor.create({
      data: {
        address,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  private handleCustomerRegistration() {
    return;
  }
}
