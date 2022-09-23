import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../../src/auth/decorator/get-user.decorator';
import { JwtGuard } from '../../src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getMe(@GetUser() user: User) {
    return { user: user };
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
