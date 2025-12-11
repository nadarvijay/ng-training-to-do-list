import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Task } from '../../models/task.model';
import { TASK_DATA } from '../../constants/tasks.data';

@Component({
  selector: 'app-task-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-data-table.component.html',
  styleUrl: './task-data-table.component.scss'
})
export class TaskDataTableComponent {

  tasks: Task[] = TASK_DATA
  showMenu = false;
  selectedTask: Task | null = null;

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
    console.log('Delete:', task);
    this.showMenu = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const insideMenu = (event.target as HTMLElement).closest('.slds-dropdown');
    if (!insideMenu) this.showMenu = false;
  }


}
