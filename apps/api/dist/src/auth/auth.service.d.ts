import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export type AuthUser = {
    id: string;
    email: string;
    name: string;
};
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    private getAdminUser;
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
}
