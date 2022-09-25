import { ContactService } from './contact.service';
import { CreateContactDto, EditContactDto } from './dto';
export declare class ContactController {
    private contactService;
    constructor(contactService: ContactService);
    createContact(ownerId: number, dto: CreateContactDto): Promise<import(".prisma/client").Contact>;
    getContacts(ownerId: number): Promise<import(".prisma/client").Contact[]>;
    getContactById(ownerId: number, contactId: number): Promise<import(".prisma/client").Contact>;
    editContactById(ownerId: number, contactId: number, dto: EditContactDto): Promise<import(".prisma/client").Contact>;
    deleteContactById(ownerId: number, contactId: number): Promise<void>;
}
