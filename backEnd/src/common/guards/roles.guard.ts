import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../generated/prisma';
import { AccessTokenPayload } from '../../modules/auth/interfaces/jwt-payload.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 从所有Hanlder和module查找有没有roles元数据
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) {
      return true;
    }
    // 有role元数据就从user里查该用户有没有这个role
    const request = context
      .switchToHttp()
      .getRequest<{ user?: AccessTokenPayload }>();
    return !!request.user && roles.includes(request.user.role);
  }
}
