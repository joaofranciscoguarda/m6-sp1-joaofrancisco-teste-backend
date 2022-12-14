import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDto,
  LoginUserDto,
} from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: CreateUserDto) {
    // create hash
    const hash = await argon.hash(dto.password);
    //save user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email,
          cellphone: dto.cellphone,
          hash,
        },
      });
      // Transformers here
      delete user.hash;

      return this.signToken(
        user,
        user.email,
        user.role,
      );
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'This user already exists, try changing e-mail or cellphone',
          );
        }
      }
    }
  }

  async signin(dto: LoginUserDto) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
        include: {
          contacts: true,
        },
      });

    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );

    if (!pwMatches) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    delete user.hash;

    return this.signToken(
      user,
      user.email,
      user.role,
    );
  }

  async signToken(
    user: object,
    email: string,
    role: string,
  ): Promise<{ user: object; token: string }> {
    const payload = {
      sub: user,
      email,
      role,
    };

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '1d',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return { user: user, token: token };
  }
}
