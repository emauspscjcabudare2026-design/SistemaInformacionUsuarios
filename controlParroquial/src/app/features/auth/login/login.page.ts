// src/app/features/auth/login/login.page.ts

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <section class="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 class="text-2xl font-bold text-slate-900">Iniciar sesión</h1>

        <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label class="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              formControlName="email"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="admin@demo.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              formControlName="password"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="••••••••"
            />
          </div>

          @if (errorMessage) {
            <p class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {{ errorMessage }}
            </p>
          }

          <button
            type="submit"
            [disabled]="form.invalid || loading"
            class="w-full rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </section>
    </main>
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.form.getRawValue();

      const appUser = await this.authService.loginAndLoadProfile(
        email,
        password,
      );

      await this.router.navigateByUrl(`/${appUser.role}`);
    } catch (error) {
      console.error(error);

      this.errorMessage = 'Credenciales inválidas o usuario no autorizado.';
    } finally {
      this.loading = false;
    }
  }

}
