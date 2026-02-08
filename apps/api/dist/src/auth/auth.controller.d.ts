import { AuthService } from './auth.service';
type LoginDto = {
    email: string;
    password: string;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    me(req: {
        user: {
            sub: string;
            email: string;
            name: string;
        };
    }): {
        id: string;
        email: string;
        name: string;
    };
}
export {};
