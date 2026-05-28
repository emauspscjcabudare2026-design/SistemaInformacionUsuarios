export type Permission =
  | 'users.create'
  | 'users.read'
  | 'users.update'
  | 'users.delete'
  | 'pastorales.create'
  | 'pastorales.read'
  | 'pastorales.update'
  | 'pastorales.delete';

export interface Role {
  id: string;
  nombre: string;
  descripcion?: string;
  permisos: Permission[];
}
