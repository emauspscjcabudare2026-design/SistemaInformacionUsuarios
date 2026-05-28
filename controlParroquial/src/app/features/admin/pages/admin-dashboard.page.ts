import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  template: `
    <section class="rounded-xl bg-white p-8 shadow">
      <h1 class="text-2xl font-bold text-slate-900">Panel administrador</h1>
      <p class="mt-2 text-slate-600">
        Aquí el admin podrá crear, editar y eliminar usuarios.
      </p>
    </section>
  `,
})
export class AdminDashboardPage {}
