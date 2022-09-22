import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService{
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto){
    // create hash
    const hash = await argon.hash(dto.password)
    //save user in db
    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        cellphone: dto.cellphone,
        hash
      },
    })
    // PAREI AQUI 1:06:00 TRANSFORMERS

    //return saved user

  }
  
  signin() {

  }
}

