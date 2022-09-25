import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(
    userId: number,
    dto: EditUserDto,
    paramUserId: number,
  ) {
    const findUser =
      await this.prisma.user.findFirst({
        where: {
          id: paramUserId,
        },
      });

    if (!findUser) {
      throw new NotFoundException(
        'User not found',
      );
    }

    if (userId !== paramUserId) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }

    const updatedUser =
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });

    delete updatedUser.hash;

    return updatedUser;
  }
}
