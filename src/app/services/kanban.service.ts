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
  tasks$ = new BehaviorSubject<KanbanTaskModel[]>([]);

  constructor() { }

  initTasks(): void {
    this.tasks$.next(TASKS_MOCK_UP);
  }

  moveTask(movingTask: KanbanTaskModel, newStatus: KanbanTaskStatusesEnum) {
    const newTasks = [...this.tasks$.value];
    const movingTaskIndex = newTasks.findIndex(task => task.id === movingTask.id);

    if (movingTaskIndex >= 0) {
      newTasks[movingTaskIndex].status = newStatus;
    }

    this.tasks$.next(newTasks);
  }
}
