import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_ADMIN_KEY } from 'src/common/decorators/admin.decorator';
import { User } from 'src/auth/user.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiresAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiresAdmin) return true; // route sans @AdminOnly() → laissée passer

    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user as User; // garanti non-null par ApiKeyGuard

    /**
     *   /!\ ATTENTION ICI ON RENVOIE TRUE PAR DEFAUT ET ON FAIT CONFIANCE AUX DONNEES DU USER
     *  CPDT ON NE DEVRAIT PAS LE FAIRE POUR VERROUILLER STRICTEMENT L ACCES
     */


    if (user.role !== 'admin') {
      throw new ForbiddenException('This action requires administrator privileges.'); // → 403
    }
    return true;
  }
}