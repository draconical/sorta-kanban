import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-kanban-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kanban-task.component.html',
  styleUrl: './kanban-task.component.scss',
  imports: [],
})
export class KanbanTaskComponent {

}
