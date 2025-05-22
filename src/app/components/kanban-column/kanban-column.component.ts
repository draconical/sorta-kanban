import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-kanban-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.scss',
  imports: [],
})
export class KanbanColumnComponent {

}
