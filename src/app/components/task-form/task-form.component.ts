import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { ModalType } from '../../models/modal.model';
import { Subject, combineLatest, takeUntil } from 'rxjs';

const ASSIGNED_DEFAULT = "Select a User";
const STATUS_DEFAULT = "Select a User";
const PRIORITY_DEFAULT = "Select a User";

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

    // Event to Close on outside click of Dropdown
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const inside = target.closest('.custom-combobox');

      if (!inside) {
        this.isAssignedOpen = false;
        this.isStatusOpen = false;
        this.isPriorityOpen = false;
      }
    });

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
  selectedAssigned = ASSIGNED_DEFAULT;
  assignedOptions = ['Accounts', 'Reports', 'Contacts', 'Files', 'Groups', 'Leads', 'Notes'];

  // Status
  isStatusOpen = false;
  selectedStatus = STATUS_DEFAULT;
  statusOptions = ['Not Started', 'In Progress', 'Completed'];

  // Priority
  isPriorityOpen = false;
  selectedPriority = PRIORITY_DEFAULT;
  priorityOptions = ['Low', 'Normal', 'High'];

  // Description
  description: string = '';

  // Due Date
  dueDate: string = '';

  // Getter function for isFormValid
  get isFormValid(): boolean {
    return (
      this.selectedAssigned !== ASSIGNED_DEFAULT &&
      this.selectedStatus !== STATUS_DEFAULT &&
      this.selectedPriority !== PRIORITY_DEFAULT
    );
  }


  //Dropdown Toggles
  toggleAssigned() {
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

  // Reset Form
  private resetForm() {
    this.selectedAssigned = ASSIGNED_DEFAULT;
    this.selectedStatus = STATUS_DEFAULT;
    this.selectedPriority = PRIORITY_DEFAULT;
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

    if (!this.isFormValid) {
      return;
    }

    if (this.modalType === 'editForm' && this.selectedTask) {
      this.taskService.updateTask({
        id: this.selectedTask.id,
        assignedTo: this.selectedAssigned,
        status: this.selectedStatus,
        priority: this.selectedPriority,
        dueDate: this.dueDate,
        comments: this.description
      });
    } else {
      this.taskService.addTask({
        assignedTo: this.selectedAssigned,
        status: this.selectedStatus,
        priority: this.selectedPriority,
        dueDate: this.dueDate,
        comments: this.description
      });
    }

    this.closeModal();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
