import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt.guard'

type LoginDto = {
  email: string
  password: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: { user: { sub: string; email: string; name: string } }) {
    return {
      id: req.user.sub,
      email: req.user.email,
      name: req.user.name,
    }
  }
}
