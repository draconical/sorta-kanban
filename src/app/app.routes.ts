import { Routes } from '@angular/router';
import { KanbanComponent } from './pages/kanban/kanban.component';

export const routes: Routes = [
  { path: '', redirectTo: 'kanban', component: KanbanComponent }
];
