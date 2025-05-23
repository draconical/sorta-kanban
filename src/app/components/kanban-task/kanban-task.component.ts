import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KanbanTaskModel, KanbanTaskStatusesEnum } from '@models/kanban.model';
import { KanbanService } from '@services/kanban.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-kanban-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kanban-task.component.html',
  styleUrl: './kanban-task.component.scss',
  imports: [],
})
export class KanbanTaskComponent implements OnInit, AfterViewInit {
  private readonly kanbanService = inject(KanbanService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() task!: KanbanTaskModel;

  @ViewChild('taskCardRef', { static: false }) taskCardRef!: ElementRef<HTMLElement>;

  private holdingTimer: any = null;
  private holdingDuration = 150;
  private canBeDragged = false;

  get taskCardElement(): HTMLElement {
    return this.taskCardRef.nativeElement;
  }

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    fromEvent(this.taskCardElement, 'mousedown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if ((event as MouseEvent).button === 2) {
          return;
        }

        this.holdingTimer = setTimeout(() => {
          this.canBeDragged = true;
          this.moveCardToPos(event as MouseEvent);
        }, this.holdingDuration);
      })

    fromEvent(this.taskCardElement, 'mousemove')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (this.canBeDragged) {
          this.moveCardToPos(event as MouseEvent);
        }
      })

    fromEvent(this.taskCardElement, 'mouseup')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (this.canBeDragged) {
          this.taskCardElement.classList.add('no-events');

          const elementBelow = this.getElementBelow(event as MouseEvent);
          if (elementBelow) {
            const columnStatus = elementBelow.attributes.getNamedItem('data-status')?.value;

            if (columnStatus) {
              this.kanbanService.moveTask(this.task, columnStatus as KanbanTaskStatusesEnum);
            }
          }
        }

        clearTimeout(this.holdingTimer);
        this.canBeDragged = false;

        this.taskCardElement.classList.remove('dragging');
        this.taskCardElement.classList.remove('no-events');
      })
  }

  private getElementBelow(mouseEvent: MouseEvent): Element | null {
    const eventPosX = mouseEvent.clientX;
    const eventPosY = mouseEvent.clientY;

    return document.elementFromPoint(eventPosX, eventPosY);
  }

  private moveCardToPos(mouseEvent: MouseEvent): void {
    const originalWidth = this.taskCardElement.children[0].clientWidth;
    const originalHeight = this.taskCardElement.clientHeight;

    // Положение mouseEvent
    const eventPosX = mouseEvent.clientX;
    const eventPosY = mouseEvent.clientY;

    // Включаем режим перетаскивания
    this.taskCardElement.classList.add('dragging');

    // Возвращаем оригинальную width (в силу того, что колонки не фиксированы)
    this.taskCardElement.style.width = originalWidth + 'px';

    // Меняем положение карточки относительно положения мыши с учётом размеров самой карточки
    this.taskCardElement.style.top = (eventPosY - (originalHeight / 2)) + 'px';
    this.taskCardElement.style.left = (eventPosX - (originalWidth / 2)) + 'px';
  }
}
