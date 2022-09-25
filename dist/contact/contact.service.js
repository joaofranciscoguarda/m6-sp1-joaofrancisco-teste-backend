"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContactService = class ContactService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createContact(ownerId, dto) {
        const contact = await this.prisma.contact.create({
            data: Object.assign({ ownerId }, dto),
        });
        return contact;
    }
    async getContacts(ownerId) {
        return await this.prisma.contact.findMany({
            where: {
                ownerId,
            },
        });
    }
    async getContactById(ownerId, contactId) {
        return await this.prisma.contact.findFirstOrThrow({
            where: {
                id: contactId,
                ownerId,
            },
        });
    }
    async editContactById(ownerId, contactId, dto) {
        const contact = await this.prisma.contact.findUniqueOrThrow({
            where: { id: contactId },
        });
        if (!contact || contact.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Access to resources denied');
        }
        this.prisma.contact.update({
            where: {
                id: contactId,
            },
            data: Object.assign({}, dto),
        });
        return contact;
    }
    async deleteContactById(ownerId, contactId) {
        const contact = await this.prisma.contact.findFirst({
            where: { id: contactId },
        });
        console.log(ownerId);
        console.log(contactId);
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        else if (contact.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Access to resources denied');
        }
        await this.prisma.contact.delete({
            where: {
                id: contactId,
            },
        });
    }
};
ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactService);
exports.ContactService = ContactService;
//# sourceMappingURL=contact.service.js.map