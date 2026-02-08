import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

export type AuthUser = {
  id: string
  email: string
  name: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getAdminUser(): { email: string; password: string; name: string; id: string } {
    return {
      id: 'admin-1',
      email: this.configService.get<string>('ADMIN_EMAIL') || 'admin@smart-fnb.local',
      password: this.configService.get<string>('ADMIN_PASSWORD') || 'admin1234',
      name: this.configService.get<string>('ADMIN_NAME') || '관리자',
    }
  }

  async login(email: string, password: string) {
    const admin = this.getAdminUser()
    if (email !== admin.email || password !== admin.password) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = { sub: admin.id, email: admin.email, name: admin.name }
    const accessToken = await this.jwtService.signAsync(payload)

    return {
      accessToken,
      user: { id: admin.id, email: admin.email, name: admin.name },
    }
  }
}
