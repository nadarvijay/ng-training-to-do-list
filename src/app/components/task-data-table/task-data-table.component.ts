import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ModalService } from '../../services/modal.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-data-table.component.html',
  styleUrl: './task-data-table.component.scss'
})
export class TaskDataTableComponent implements OnDestroy {

  tasks: Task[] = []
  showMenu = false;
  selectedTask: Task | null = null;
  private destroy$ = new Subject<void>();
  highlightedTaskId: string | null = null;

  dropdownPosition = {
    top: '0px',
    left: '0px'
  };

  constructor(
    private taskService: TaskService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.taskService.pagedTasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
      });

    this.taskService.highlightedTaskId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        this.highlightedTaskId = id;
      });
  }

  // To Open Edit/Delete Menu
  openMenu(event: MouseEvent, task: Task) {
    event.stopPropagation();

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.dropdownPosition = {
      top: rect.bottom + 'px',
      left: rect.right - 120 + 'px'
    };

    this.selectedTask = task;
    this.showMenu = true;
  }

  // Edit Selected Task Handler
  editTask(task: Task) {
    this.modalService.openEditForm(task);
    this.showMenu = false;
  }

  // Delete Selected Task Handler
  deleteTask(task: Task) {
    this.modalService.openDeleteModal(task)
    this.showMenu = false;
  }

  // Closes The Menu When Clicked Outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const insideMenu = (event.target as HTMLElement).closest('.slds-dropdown');
    if (!insideMenu) this.showMenu = false;
  }

  // On Component Destroy
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
