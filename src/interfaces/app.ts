import type { User } from '@/server/auth/user';

export interface Locals {
  user?: User;
  session_id?: string;
}
export interface ClientSession {
  name?: string;
  id?: string;
  access?: string;
  avatar?: string;
}
