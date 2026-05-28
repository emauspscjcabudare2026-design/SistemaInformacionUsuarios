// src/app/features/coordinator/coordinator-dashboard.page.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-coordinator-dashboard-page',
  standalone: true,
  template: `
    <main class="min-h-screen bg-slate-100 p-8">
      <section class="rounded-xl bg-white p-8 shadow">
        <h1 class="text-2xl font-bold text-slate-900">Panel coordinador</h1>
        <p class="mt-2 text-slate-600">
          Vista exclusiva para usuarios coordinadores.
        </p>
      </section>
    </main>
  `,
})
export class CoordinatorDashboardPage {}
