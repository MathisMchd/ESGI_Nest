import { Body, Controller, Delete, Get, HttpCode, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import type { RegisterDto } from './dto/register.dto';
import { Public } from 'src/common/decorators/public.decorators';
import { AdminOnly } from 'src/common/decorators/admin.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()       // pas besoin d'auth pour s'inscrire cf api-key.guard.ts
    @Post('register')
    register(@Body() body: RegisterDto) {
        return this.authService.register(body.email);  // → 201 { apiKey }
    }

    @Get('me')
    getMe(@Req() req: Request) {
        const user = (req as any).user;
        return this.authService.getMe(user.apiKey);    // → 200
    }

    @AdminOnly()
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
