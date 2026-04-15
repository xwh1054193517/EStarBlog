import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AccessTokenPayload } from '../../modules/auth/interfaces/jwt-payload.interface';

export const getCurrentUserDec = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AccessTokenPayload | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: AccessTokenPayload }>();

    return request.user;
  },
);
