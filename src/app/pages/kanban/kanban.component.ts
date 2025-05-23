import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { KanbanService } from '@services/kanban.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { KanbanColumnComponent } from "../../components/kanban-column/kanban-column.component";
import { KanbanTaskStatusesEnum, KanbanTasksByColumns } from '@models/kanban.model';

@Component({
  selector: 'app-kanban',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
  imports: [KanbanColumnComponent],
})
export class KanbanComponent implements OnInit {
  private readonly kanbanService = inject(KanbanService);

  readonly kanbanTaskStatusesEnum = KanbanTaskStatusesEnum;
  tasks = toSignal(this.kanbanService.tasks$);
  columns = signal<KanbanTasksByColumns | null>(null);

  constructor() {
    effect(() => {
      const tasks = this.tasks();
      if (tasks) {
        const newColumns: KanbanTasksByColumns = {
          Start: [],
          InProgress: [],
          Completed: [],
          Expired: [],
        }

        tasks.forEach((task) => {
          newColumns[task.status].push(task);
        });

        this.columns.set(newColumns);
      }
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.kanbanService.initTasks();
  }
}
