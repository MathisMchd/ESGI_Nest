import { Body, Controller, Delete, Get, HttpCode, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/common/decorators/public.decorators';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    register(@Body() body: RegisterDto) {
        console.log("Body", body)
        return this.authService.register(body.email);  // → 201 { apiKey }
    }

    @Get('me')
    getMe(@Req() req: Request) {
        const user = (req as any).user;
        return this.authService.getMe(user.apiKey);    // → 200
    }

    @Post('regenerate-key')
    regenerateKey(@Req() req: Request) {
        return this.authService.regenerateKey((req as any).user.apiKey); // → 200 { apiKey }
    }

    @Delete('account')
    @HttpCode(204)
    deleteAccount(@Req() req: Request) {
        this.authService.deleteAccount((req as any).user.apiKey);        // → 204
    }
}
