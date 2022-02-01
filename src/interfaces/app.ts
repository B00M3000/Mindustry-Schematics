import { ServerSession } from '@/server/auth/session';

export interface Locals {
  session?: ServerSession;
}
export interface ClientSession {
  name?: string;
  id?: string;
  access?: string;
  avatar?: string;
}
