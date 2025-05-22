import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { KanbanService } from '@services/kanban.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-kanban',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
  imports: [],
})
export class KanbanComponent implements OnInit {
  private readonly kanbanService = inject(KanbanService);

  columns = toSignal(this.kanbanService.columns$);

  constructor() { }

  ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    const data = this.kanbanService.formColumns();
  }
}
