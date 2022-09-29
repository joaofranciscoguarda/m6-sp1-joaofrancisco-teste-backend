import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    editUser(userId: number, dto: EditUserDto, paramUserId: number): Promise<import(".prisma/client").User & {
        contacts: import(".prisma/client").Contact[];
    }>;
}
