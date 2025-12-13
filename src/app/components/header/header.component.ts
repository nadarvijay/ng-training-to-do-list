import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    private modalService: ModalService,
    public taskService: TaskService
  ) { }

  // Add New Task Handler
  openCreateTask() {
    this.modalService.openAddForm();
  }

  // Refresh Button Handler
  handleRefresh() {
    this.taskService.resetState();
  }
}
