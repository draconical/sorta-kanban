import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, inject, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { KanbanService } from '@services/kanban.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { KanbanColumnComponent } from "../../components/kanban-column/kanban-column.component";
import { KanbanTaskStatusesEnum, KanbanTasksByColumns } from '@models/kanban.model';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-kanban',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
  imports: [KanbanColumnComponent],
})
export class KanbanComponent implements OnInit, AfterViewInit {
  private readonly kanbanService = inject(KanbanService);
  private readonly destroyRef = inject(DestroyRef);

  readonly kanbanTaskStatusesEnum = KanbanTaskStatusesEnum;
  tasks = toSignal(this.kanbanService.tasks$);
  columns = signal<KanbanTasksByColumns | null>(null);

  @ViewChild("kanbanRef", { static: false }) kanbanRef!: ElementRef<HTMLElement>;
  private selectedCard: HTMLElement | null = null;
  private holdingTimer: any = null;
  private readonly holdingDuration = 250;
  private canBeDragged = false;

  get kanbanElement(): HTMLElement {
    return this.kanbanRef.nativeElement;
  }

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

  ngAfterViewInit(): void {
    fromEvent(this.kanbanElement, 'mousedown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if ((event as MouseEvent).button === 2) {
          return;
        }

        // Выясняем, карточка это или нет
        const clickedElement = this.getElementBelow(event as MouseEvent);
        if (clickedElement) {
          const isTaskCard = clickedElement.classList.contains('kanban-task');

          if (isTaskCard) {
            this.selectedCard = clickedElement as HTMLElement;

            // Запускаем механизм отрыва
            this.holdingTimer = setTimeout(() => {
              this.canBeDragged = true;
              this.moveCardToPos(event as MouseEvent);
            }, this.holdingDuration);
          }
        }
      })

    fromEvent(this.kanbanElement, 'mousemove')
      .pipe(debounceTime(10), takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (!this.canBeDragged) return;

        if (this.selectedCard) {
          this.moveCardToPos(event as MouseEvent);
        }
      })

    fromEvent(this.kanbanElement, 'mouseup')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (this.canBeDragged) {
          if (!this.selectedCard) return;

          this.selectedCard.classList.add('no-events');

          // Выясняем, колонка ли это (и если да, то какая)
          const elementBelow = this.getElementBelow(event as MouseEvent);
          if (elementBelow) {
            const columnStatus = elementBelow.attributes.getNamedItem('data-status')?.value;
            const taskId = this.selectedCard.attributes.getNamedItem('data-id')?.value;

            if (columnStatus && taskId) {
              this.kanbanService.moveTask(+taskId, columnStatus as KanbanTaskStatusesEnum);
            }
          }
        }

        // Откатываем все параметры и таймеры вместе с классами для переноса
        if (this.selectedCard) {
          this.canBeDragged = false;
          clearTimeout(this.holdingTimer);

          this.selectedCard.classList.remove('dragging');
          this.selectedCard.classList.remove('no-events');
        }
      })

    fromEvent(this.kanbanElement, 'mouseout')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        // Откатываем все параметры и таймеры вместе с классами для переноса
        if (this.selectedCard) {
          this.canBeDragged = false;
          clearTimeout(this.holdingTimer);

          this.selectedCard.classList.remove('dragging');
          this.selectedCard.classList.remove('no-events');
        }
      })
  }

  private getData(): void {
    this.kanbanService.initTasks();
  }

  private getElementBelow(mouseEvent: MouseEvent): Element | null {
    const eventPosX = mouseEvent.clientX;
    const eventPosY = mouseEvent.clientY;

    return document.elementFromPoint(eventPosX, eventPosY);
  }

  private moveCardToPos(mouseEvent: MouseEvent): void {
    if (!this.selectedCard) return;

    const originalWidth = this.selectedCard.children[0].clientWidth;
    const originalHeight = this.selectedCard.clientHeight;

    // Положение mouseEvent
    const eventPosX = mouseEvent.clientX;
    const eventPosY = mouseEvent.clientY;

    // Включаем режим перетаскивания
    this.selectedCard.classList.add('dragging');

    // Возвращаем оригинальную width (в силу того, что колонки не фиксированы)
    this.selectedCard.style.width = originalWidth + 'px';

    // Меняем положение карточки относительно положения мыши с учётом размеров самой карточки
    this.selectedCard.style.top = (eventPosY - (originalHeight / 2)) + 'px';
    this.selectedCard.style.left = (eventPosX - (originalWidth / 2)) + 'px';
  }
}
