import type { ServerSession } from '@/server/auth/session';
import type { User } from '@/server/auth/user';

export interface Locals {
  user?: User;
  session?: ServerSession;
}
export interface ClientSession {
  name?: string;
  id?: string;
  access?: string;
  avatar?: string;
}
