import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
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

  @Patch(':userId')
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
    @Param('userId', ParseIntPipe)
    paramUserId: number,
  ) {
    return this.userService.editUser(
      userId,
      dto,
      paramUserId,
    );
  }
}
