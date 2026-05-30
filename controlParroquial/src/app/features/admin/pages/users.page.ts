// src/app/features/admin/pages/users.page.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppUser } from '../../../core/models/app-user.model';
import { UserRepository } from '../../../core/repositories/user.repository';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.page.html',
})
export class UsersPage implements OnInit {
  private readonly userRepository = inject(UserRepository);

  protected readonly users = signal<AppUser[]>([]);
  protected readonly editingUid = signal<string | null>(null);
  protected readonly loading = signal<boolean>(false);

  protected form: AppUser = this.createEmptyForm();

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loading.set(true);

    try {
      const users = await this.userRepository.findAll();
      this.users.set(users);
    } finally {
      this.loading.set(false);
    }
  }

  edit(user: AppUser): void {
    this.editingUid.set(user.uid);

    this.form = {
      ...user,
    };
  }

  async save(): Promise<void> {
    if (!this.editingUid()) {
      return;
    }

    if (!this.form.uid || !this.form.email || !this.form.role) {
      return;
    }

    await this.userRepository.createOrUpdate({
      ...this.form,
      email: this.form.email.trim(),
      displayName: this.form.displayName?.trim(),
    });

    this.resetForm();
    await this.loadUsers();
  }

  async toggleActive(user: AppUser): Promise<void> {
    await this.userRepository.createOrUpdate({
      ...user,
      active: !user.active,
    });

    await this.loadUsers();
  }

  async remove(user: AppUser): Promise<void> {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar el perfil de ${user.email}?`,
    );

    if (!confirmed) {
      return;
    }

    await this.userRepository.delete(user.uid);

    if (this.editingUid() === user.uid) {
      this.resetForm();
    }

    await this.loadUsers();
  }

  resetForm(): void {
    this.editingUid.set(null);
    this.form = this.createEmptyForm();
  }

  private createEmptyForm(): AppUser {
    return {
      uid: '',
      email: '',
      displayName: '',
      role: 'observer',
      active: true,
      createdAt: null,
      updatedAt: null,
    };
  }
}
