// src/app/core/models/app-user.model.ts

import { Role } from './role.model';

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  role: Role;
  active: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
