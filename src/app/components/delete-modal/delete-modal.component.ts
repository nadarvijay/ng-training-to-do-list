import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent implements OnInit, OnDestroy {

  task: Task | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public modalService: ModalService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.modalService.selectedTask$
      .pipe(takeUntil(this.destroy$))
      .subscribe(task => {
        this.task = task;
      });
  }

  // Close Modal
  closeModal() {
    this.modalService.close();
  }

  // Delete the Selected Task
  confirmDelete() {
    if (!this.task) return;

    this.taskService.deleteTask(this.task.id);
    this.modalService.close();
  }

  // on Component Destroy
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
