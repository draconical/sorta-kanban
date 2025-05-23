import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { KanbanTaskModel, KanbanTaskStatusesEnum } from '@models/kanban.model';
import { KanbanTaskComponent } from "../kanban-task/kanban-task.component";

@Component({
  selector: 'app-kanban-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.scss',
  imports: [KanbanTaskComponent],
})
export class KanbanColumnComponent {
  @Input() title!: string;
  @Input() tasks!: KanbanTaskModel[];
  @Input() status!: KanbanTaskStatusesEnum;

  constructor() {}
}
