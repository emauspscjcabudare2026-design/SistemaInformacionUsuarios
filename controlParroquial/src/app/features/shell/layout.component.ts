// src/app/features/shell/layout.component.ts

import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-100">
      <header class="border-b bg-white px-8 py-4 shadow-sm">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-lg font-bold text-slate-900">
              Sistema de Gestión
            </h1>

            <p class="text-sm text-slate-500">
              {{ authService.appUser()?.email }}
              ·
              {{ authService.appUser()?.role }}
            </p>
          </div>

          <nav class="flex items-center gap-3">
            @if (authService.appUser()?.role === 'admin') {
              <a
                routerLink="/admin"
                class="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Admin
              </a>
            }

            @if (authService.appUser()?.role === 'coordinator') {
              <a
                routerLink="/coordinator"
                class="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Coordinador
              </a>
            }

            @if (authService.appUser()?.role === 'observer') {
              <a
                routerLink="/observer"
                class="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Observador
              </a>
            }

            <button
              type="button"
              class="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
              (click)="logout()"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>

      <main class="p-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class LayoutComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
