import { KanbanTasksByColumns } from './../models/kanban.model';
import { Injectable } from '@angular/core';
import { KanbanTaskModel, KanbanTaskStatusesEnum } from '@models/kanban.model';
import { BehaviorSubject } from 'rxjs';

const TASKS_MOCK_UP: KanbanTaskModel[] = [
  { id: 0, status: KanbanTaskStatusesEnum.Expired, title: 'Стать королём шаманов', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod dolor eget purus tincidunt gravida. Suspendisse quis augue at metus sollicitudin vestibulum. Etiam ligula urna, tincidunt eu pretium et, rhoncus sit amet turpis.' },
  { id: 1, status: KanbanTaskStatusesEnum.Completed, title: 'Родиться', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod dolor eget purus tincidunt gravida. Suspendisse quis augue at metus sollicitudin vestibulum. Etiam ligula urna, tincidunt eu pretium et, rhoncus sit amet turpis.' },
  { id: 2, status: KanbanTaskStatusesEnum.InProgress, title: 'Найти своё призвание', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod dolor eget purus tincidunt gravida. Suspendisse quis augue at metus sollicitudin vestibulum. Etiam ligula urna, tincidunt eu pretium et, rhoncus sit amet turpis.' },
  { id: 3, status: KanbanTaskStatusesEnum.InProgress, title: 'Получить новый опыт', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod dolor eget purus tincidunt gravida. Suspendisse quis augue at metus sollicitudin vestibulum. Etiam ligula urna, tincidunt eu pretium et, rhoncus sit amet turpis.' },
  { id: 4, status: KanbanTaskStatusesEnum.Start, title: 'Построить дерево', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod dolor eget purus tincidunt gravida. Suspendisse quis augue at metus sollicitudin vestibulum. Etiam ligula urna, tincidunt eu pretium et, rhoncus sit amet turpis.' },
  { id: 5, status: KanbanTaskStatusesEnum.Start, title: 'Посадить дом', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod dolor eget purus tincidunt gravida. Suspendisse quis augue at metus sollicitudin vestibulum. Etiam ligula urna, tincidunt eu pretium et, rhoncus sit amet turpis.' },
];

@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  columns$ = new BehaviorSubject<KanbanTasksByColumns | null>(null);

  constructor() { }

  formColumns(tasks: KanbanTaskModel[] = TASKS_MOCK_UP): void {
    const columns: KanbanTasksByColumns = {
      Start: [],
      InProgress: [],
      Completed: [],
      Expired: [],
    };

    tasks.forEach((task) => { columns[task.status].push(task) });

    this.columns$.next(columns);
  }

  moveTask(task: KanbanTaskModel, newStatus: KanbanTaskStatusesEnum) {
    let newColumns = this.columns$.value;
    if (!newColumns) {
      return;
    }

    const columnFrom = newColumns[task.status];
    const columnTo = newColumns[newStatus];
    const taskIndexInColumn = columnFrom.findIndex(t => t.id === task.id);

    // Удаляем задачу из старой колонки
    columnFrom.splice(taskIndexInColumn, 1);

    // Добавляем задачу в новую
    columnTo.push(task);

    // Перезаписываем данные
    this.columns$.next(newColumns);
  }
}
