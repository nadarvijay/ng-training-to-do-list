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

  private selectedTaskSubject = new BehaviorSubject<Task | null>(null);
  selectedTask$ = this.selectedTaskSubject.asObservable();


  openAddForm() {
    this.selectedTaskSubject.next(null);
    this.modalState.next('addForm');
  }

  openEditForm(task: Task) {
    this.selectedTaskSubject.next(task);
    this.modalState.next('editForm');
  }

  openDeleteModal(task: Task) {
    this.selectedTaskSubject.next(task);
    this.modalState.next('delete');
  }

  close() {
    this.modalState.next(null);
    this.selectedTaskSubject.next(null);
  }
}
