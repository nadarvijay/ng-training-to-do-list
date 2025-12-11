import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {

  task: Task | null = null;

  constructor(
    public modalService: ModalService,
    private taskService: TaskService
  ) {
    this.modalService.deleteTask$.subscribe(task => {
      this.task = task;
    });
  }

  closeModal() {
    this.modalService.close();
  }

  confirmDelete() {
    if (!this.task) return;

    this.taskService.deleteTask(this.task.id);
    this.modalService.close();
  }
}
