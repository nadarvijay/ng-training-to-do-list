import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalType } from '../models/modal.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalState = new BehaviorSubject<ModalType>(null);
  modalState$ = this.modalState.asObservable();

  private deleteTaskSubject = new BehaviorSubject<Task | null>(null);
  deleteTask$ = this.deleteTaskSubject.asObservable();

  openTaskForm() {
    this.modalState.next('taskForm');
  }

  openDeleteModal(task: Task) {
    this.deleteTaskSubject.next(task);
    this.modalState.next('delete');
  }

  close() {
    this.modalState.next(null);
    this.deleteTaskSubject.next(null);
  }
}
