import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signup(dto: CreateUserDto): Promise<{
        user: object;
        token: string;
    }>;
    signin(dto: LoginUserDto): Promise<{
        user: object;
        token: string;
    }>;
    signToken(user: object, email: string, role: string): Promise<{
        user: object;
        token: string;
    }>;
}
