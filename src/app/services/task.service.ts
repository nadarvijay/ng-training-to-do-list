import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Task } from '../models/task.model';
import { TASK_DATA } from '../constants/tasks.data';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // STATE
  private tasksSubject = new BehaviorSubject<Task[]>(TASK_DATA);
  private pageSizeSubject = new BehaviorSubject<number>(10);
  private currentPageSubject = new BehaviorSubject<number>(1);

  // PUBLIC OBSERVABLES
  tasks$ = this.tasksSubject.asObservable();
  pageSize$ = this.pageSizeSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();

  //PAGINATED TASKS
  pagedTasks$ = combineLatest([
    this.tasks$,
    this.pageSize$,
    this.currentPage$
  ]).pipe(
    map(([tasks, pageSize, currentPage]) => {
      const start = (currentPage - 1) * pageSize;
      return tasks.slice(start, start + pageSize);
    })
  );

  // TOTAL PAGES
  totalPages$ = combineLatest([
    this.tasks$,
    this.pageSize$
  ]).pipe(
    map(([tasks, pageSize]) => Math.ceil(tasks.length / pageSize))
  );

  // ---- CRUD ----
  addTask(task: Task) {
    const newTask = { ...task, id: crypto.randomUUID() };
    this.tasksSubject.next([...this.tasksSubject.value, newTask]);
  }

  updateTask(updatedTask: Task) {
    this.tasksSubject.next(
      this.tasksSubject.value.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  }

  deleteTask(taskId: string | undefined) {
    this.tasksSubject.next(
      this.tasksSubject.value.filter(task => task.id !== taskId)
    );
  }

  // PAGINATION ACTIONS
  setPageSize(size: number) {
    this.pageSizeSubject.next(size);
    this.currentPageSubject.next(1); // reset page
  }

  nextPage(totalPages: number) {
    const current = this.currentPageSubject.value;
    if (current < totalPages) {
      this.currentPageSubject.next(current + 1);
    }
  }

  prevPage() {
    const current = this.currentPageSubject.value;
    if (current > 1) {
      this.currentPageSubject.next(current - 1);
    }
  }

  goToFirst() {
    this.currentPageSubject.next(1);
  }

  goToLast(totalPages: number) {
    this.currentPageSubject.next(totalPages);
  }
}
