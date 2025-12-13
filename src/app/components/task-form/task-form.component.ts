import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { ModalType } from '../../models/modal.model';
import { Subject, combineLatest, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {

  constructor(
    private modalService: ModalService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {

    combineLatest([
      this.modalService.modalState$,
      this.modalService.selectedTask$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([type, task]) => {
        this.modalType = type;
        this.selectedTask = task;

        if (type === 'editForm' && task) {
          this.selectedAssigned = task.assignedTo;
          this.selectedStatus = task.status;
          this.selectedPriority = task.priority;
          this.dueDate = task.dueDate;
          this.description = task.comments;
        }
      });

  }

  // Subject to Destroy on Completion
  private destroy$ = new Subject<void>();

  // modalType - add/edit
  modalType: ModalType = 'addForm';
  selectedTask: Task | null = null

  // Assigned To
  isAssignedOpen = false;
  selectedAssigned = 'Select a User';
  assignedOptions = ['Accounts', 'Reports', 'Contacts', 'Files', 'Groups', 'Leads', 'Notes'];

  // Status
  isStatusOpen = false;
  selectedStatus = 'Select Status';
  statusOptions = ['Not Started', 'In Progress', 'Completed'];

  // Priority
  isPriorityOpen = false;
  selectedPriority = 'Select Priority';
  priorityOptions = ['Low', 'Normal', 'High'];

  // Description
  description: string = '';

  // Due Date
  dueDate: string = '';


  //Dropdown Toggles
  toggleAssigned() {
    console.log("clicked")
    this.isAssignedOpen = !this.isAssignedOpen;
    this.closeOthers('assigned');
  }

  toggleStatus() {
    this.isStatusOpen = !this.isStatusOpen;
    this.closeOthers('status');
  }

  togglePriority() {
    this.isPriorityOpen = !this.isPriorityOpen;
    this.closeOthers('priority');
  }

  // Close other dropdowns when one opens
  private closeOthers(open: 'assigned' | 'status' | 'priority') {
    if (open !== 'assigned') this.isAssignedOpen = false;
    if (open !== 'status') this.isStatusOpen = false;
    if (open !== 'priority') this.isPriorityOpen = false;
  }

  // Select Functions
  selectAssigned(item: string) {
    this.selectedAssigned = item;
    this.isAssignedOpen = false;
  }

  selectStatus(item: string) {
    this.selectedStatus = item;
    this.isStatusOpen = false;
  }

  selectPriority(item: string) {
    this.selectedPriority = item;
    this.isPriorityOpen = false;
  }

  // Close on outside click
  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    const inside = event.target.closest('.custom-combobox');
    if (!inside) {
      this.isAssignedOpen = false;
      this.isStatusOpen = false;
      this.isPriorityOpen = false;
    }
  }

  // Reset Form
  private resetForm() {
    this.selectedAssigned = 'Select a User';
    this.selectedStatus = 'Select Status';
    this.selectedPriority = 'Select Priority';
    this.dueDate = '';
    this.description = '';
    this.selectedTask = null;
  }

  // Close Form
  closeModal() {
    this.resetForm();
    this.modalService.close();
  }


  // Add/Edit Task
  submit() {
    if (this.modalType === 'editForm' && this.selectedTask) {
      // Update Task List
      this.taskService.updateTask({
        id: this.selectedTask.id,
        status: this.selectedStatus,
        assignedTo: this.selectedAssigned,
        dueDate: this.dueDate,
        priority: this.selectedPriority,
        comments: this.description,
      });
    } else {
      // Add Task List
      this.taskService.addTask({
        status: this.selectedStatus,
        assignedTo: this.selectedAssigned,
        dueDate: this.dueDate,
        priority: this.selectedPriority,
        comments: this.description,
      });
    }

    this.closeModal();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
