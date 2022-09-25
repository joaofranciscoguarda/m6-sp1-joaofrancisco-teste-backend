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
        userId: number;
        token: string;
    }>;
    signin(dto: LoginUserDto): Promise<{
        userId: number;
        token: string;
    }>;
    signToken(userId: number, email: string, role: string): Promise<{
        userId: number;
        token: string;
    }>;
}
