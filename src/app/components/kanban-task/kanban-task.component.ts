import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { KanbanTaskModel } from '@models/kanban.model';

@Component({
  selector: 'app-kanban-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kanban-task.component.html',
  styleUrl: './kanban-task.component.scss',
  imports: [],
})
export class KanbanTaskComponent {
  @Input() task!: KanbanTaskModel;
}
