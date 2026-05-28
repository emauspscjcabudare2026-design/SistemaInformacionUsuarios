import { Timestamp } from 'firebase/firestore';

export type AuditAction =
  | 'user.created'
  | 'user.updated'
  | 'user.disabled'
  | 'pastoral.created'
  | 'pastoral.updated'
  | 'pastoral.disabled';

export interface AuditLog {
  id: string;
  action: AuditAction;
  entity: 'users' | 'pastorales';
  entityId: string;
  performedBy: string;
  createdAt: Timestamp;
  changes?: Record<string, unknown>;
}
