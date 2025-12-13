import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  constructor(public taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.totalPages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(total => {
        this.totalPages = total;
        this.updatePaginationState();
      })

    this.taskService.currentPage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.currentPage = val;
        this.updatePaginationState();
      })
  }

  totalPages = 1;
  currentPage = 1;
  isFirstPage = true;
  isLastPage = false;
  private destroy$ = new Subject<void>();

  handleSelect(event: Event) {
    const size = +(event.target as HTMLSelectElement).value;  // extracting number
    this.taskService.setPageSize(size);
  }

  first() {
    this.taskService.goToFirst();
  }

  prev() {
    this.taskService.prevPage();
  }

  next() {
    this.taskService.nextPage(this.totalPages);
  }

  last() {
    this.taskService.goToLast(this.totalPages);
  }

  private updatePaginationState() {
    this.isFirstPage = this.currentPage === 1;
    this.isLastPage = this.currentPage === this.totalPages;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
