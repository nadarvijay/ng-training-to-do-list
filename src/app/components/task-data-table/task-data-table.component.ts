import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-task-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-data-table.component.html',
  styleUrl: './task-data-table.component.scss'
})
export class TaskDataTableComponent {

  tasks: Task[] = []
  showMenu = false;
  selectedTask: Task | null = null;

  constructor(
    private taskService: TaskService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  dropdownPosition = {
    top: '0px',
    left: '0px'
  };

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


  editTask(task: any) {
    console.log('Edit:', task);
    this.showMenu = false;
  }

  deleteTask(task: any) {
    this.modalService.openDeleteModal(task)
    this.showMenu = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const insideMenu = (event.target as HTMLElement).closest('.slds-dropdown');
    if (!insideMenu) this.showMenu = false;
  }


}
