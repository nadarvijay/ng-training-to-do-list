import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { TaskDataTableComponent } from "../task-data-table/task-data-table.component";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [HeaderComponent, TaskDataTableComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {

}
