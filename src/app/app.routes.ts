import { Routes } from '@angular/router';
import { KanbanComponent } from './pages/kanban/kanban.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'kanban'
  },
  {
    path: 'kanban',
    component: KanbanComponent
  }
];
