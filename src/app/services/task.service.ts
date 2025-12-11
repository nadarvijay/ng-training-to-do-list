import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';
import { TASK_DATA } from '../constants/tasks.data';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksSubject = new BehaviorSubject<Task[]>(TASK_DATA);
  tasks$ = this.tasksSubject.asObservable();

  constructor() { }

  addTask(task: Task) {
    const tasks = this.tasksSubject.value;

    const newTask: Task = {
      ...task,
      id: crypto.randomUUID()
    };

    this.tasksSubject.next([...tasks, newTask]);
  }

  updateTask(updatedTask: Task) {
    const tasks = this.tasksSubject.value;

    const updatedList = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );

    this.tasksSubject.next(updatedList);
  }

  deleteTask(taskId: string | undefined) {
    const tasks = this.tasksSubject.value;

    this.tasksSubject.next(tasks.filter(task => task.id !== taskId));
  }

  getTaskById(taskId: string) {
    return this.tasksSubject.value.find(task => task.id === taskId);
  }
}
