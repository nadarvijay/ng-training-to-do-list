import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {

  // ----- Assigned To -----
  isAssignedOpen = false;
  selectedAssigned = 'Select a User';
  assignedOptions = ['Accounts', 'Reports', 'Contacts', 'Files', 'Groups', 'Leads', 'Notes'];

  // ----- Status -----
  isStatusOpen = false;
  selectedStatus = 'Select Status';
  statusOptions = ['Not Started', 'In Progress', 'Completed'];

  // ----- Priority -----
  isPriorityOpen = false;
  selectedPriority = 'Select Priority';
  priorityOptions = ['Low', 'Normal', 'High'];

  // ---------- Dropdown Toggles ----------
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

  // ---------- Select ----------
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

  // ---------- Close on outside click ----------
  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    const inside = event.target.closest('.custom-combobox');
    if (!inside) {
      this.isAssignedOpen = false;
      this.isStatusOpen = false;
      this.isPriorityOpen = false;
    }
  }

}
