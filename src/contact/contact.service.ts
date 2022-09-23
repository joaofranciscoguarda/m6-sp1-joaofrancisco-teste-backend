import {
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Contact } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateContactDto,
  EditContactDto,
} from './dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async createContact(
    ownerId: number,
    dto: CreateContactDto,
  ) {
    const contact =
      await this.prisma.contact.create({
        data: {
          ownerId,
          ...dto,
        },
      });
    return contact;
  }

  async getContacts(ownerId: number) {
    return await this.prisma.contact.findMany({
      where: {
        ownerId,
      },
    });
  }

  async getContactById(
    ownerId: number,
    contactId: number,
  ) {
    return await this.prisma.contact.findFirstOrThrow(
      {
        where: {
          id: contactId,
          ownerId,
        },
      },
    );
  }

  async editContactById(
    ownerId: number,
    contactId: number,
    dto: EditContactDto,
  ) {
    const contact =
      await this.prisma.contact.findUniqueOrThrow(
        {
          where: { id: contactId },
        },
      );

    if (!contact || contact.ownerId !== ownerId) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }

    this.prisma.contact.update({
      where: {
        id: contactId,
      },
      data: {
        ...dto,
      },
    });

    return contact;
  }

  async deleteContactById(
    ownerId: number,
    contactId: number,
  ) {
    const contact =
      await this.prisma.contact.findUniqueOrThrow(
        {
          where: { id: contactId },
        },
      );

    if (!contact || contact.ownerId !== ownerId) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }

    await this.prisma.contact.delete({
      where: {
        id: contactId,
      },
    });
  }
}
