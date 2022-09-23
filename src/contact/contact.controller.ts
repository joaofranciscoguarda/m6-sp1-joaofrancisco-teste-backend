import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ContactService } from './contact.service';
import {
  CreateContactDto,
  EditContactDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('contact')
export class ContactController {
  constructor(
    private contactService: ContactService,
  ) {}

  //Create
  @Post()
  createContact(
    @GetUser('id') ownerId: number,
    @Body() dto: CreateContactDto,
  ) {
    return this.contactService.createContact(
      ownerId,
      dto,
    );
  }

  // Get ALl
  @Get()
  getContacts(@GetUser('id') ownerId: number) {
    return this.contactService.getContacts(
      ownerId,
    );
  }

  //Get Id
  @Get(':contactId')
  getContactById(
    @GetUser('id') ownerId: number,
    @Param('contactId', ParseIntPipe)
    contactId: number,
  ) {
    return this.contactService.getContactById(
      ownerId,
      contactId,
    );
  }

  // Update
  @Patch(':contactId')
  editContactById(
    @GetUser('id') ownerId: number,
    @Param('contactId', ParseIntPipe)
    contactId: number,
    @Body() dto: EditContactDto,
  ) {
    return this.contactService.editContactById(
      ownerId,
      contactId,
      dto,
    );
  }

  //Delete
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':contactId')
  deleteContactById(
    @GetUser('id') ownerId: number,
    @Param('contactId', ParseIntPipe)
    contactId: number,
  ) {
    return this.contactService.deleteContactById(
      ownerId,
      contactId,
    );
  }
}
