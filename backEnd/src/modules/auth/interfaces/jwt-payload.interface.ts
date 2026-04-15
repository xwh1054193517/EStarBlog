import { Role } from '../../../generated/prisma';

export interface AccessTokenPayload {
  sub: string;
  username: string;
  role: Role;
  sessionId: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  username: string;
  role: Role;
  sessionId: string;
  refreshId: string;
  type: 'refresh';
}
