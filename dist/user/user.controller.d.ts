import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(user: User): {
        user: User;
    };
    editUser(userId: number, dto: EditUserDto, paramUserId: number): Promise<User & {
        contacts: import(".prisma/client").Contact[];
    }>;
}
