import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { KanbanTaskModel } from '@models/kanban.model';

@Component({
  selector: 'app-kanban-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.scss',
  imports: [],
})
export class KanbanColumnComponent {
  @Input() title!: string;
  @Input() tasks!: KanbanTaskModel[];

  constructor() {}
}
