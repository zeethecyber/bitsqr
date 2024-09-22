import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    return await this.dbService.$transaction(async (prisma) => {
      // Hash password
      const { address, email, name, role } = createAuthDto;
      const password = this.generatePassword();
      const passwordHashed = this.hashPassword(password);
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          role,
          password: passwordHashed,
        },
      });

      // Handle registration if user is a vendor
      if (createAuthDto.role === 'vendor') {
        await prisma.vendor.create({
          data: {
            address,
            User: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      }

      // Send welcome email
      await this.mailerService.sendMail({
        to: user.email,
        from: `Zeeshan Asif <${process.env.EMAIL_USERNAME}>`,
        subject: 'Welcome to our platform',
        text: `Welcome ${user.name} to our platform. We're excited to have you on board. You can now login to your account and start exploring our platform. Please use the following credentials to login: Email: ${user.email}, Password: ${password}`,
      });

      // Return user
      delete user.password;
      return {
        data: user,
        message:
          'User created successfully. Please check your email for login credentials.',
      };
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.dbService.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }
    if (!this.comparePassword(password, user.password)) {
      return null;
    }
    return user;
  }

  async login(user: any) {
    const token = this.jwtService.sign(user);
    return {
      user,
      token,
    };
  }

  async changePassword(_user: any, oldPassword: string, newPassword: string) {
    const user = await this.dbService.user.findFirst({
      where: {
        id: _user.id,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isPasswordCorrect = this.comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new HttpException('Invalid password', 400);
    }
    const newPasswordHashed = this.hashPassword(newPassword);
    await this.dbService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPasswordHashed,
      },
    });
    return {
      message: 'Password updated successfully',
    };
  }

  private hashPassword(password: string) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }

  private comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  private generatePassword() {
    const length = 8,
      charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';

    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
}
