import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDataTableComponent } from './task-data-table.component';
import { TaskService } from '../../services/task.service';
import { ModalService } from '../../services/modal.service';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../models/task.model';

class MockTaskService {
  pagedTasksSubject = new BehaviorSubject<Task[]>([]);
  highlightedTaskIdSubject = new BehaviorSubject<string | null>(null);

  pagedTasks$ = this.pagedTasksSubject.asObservable();
  highlightedTaskId$ = this.highlightedTaskIdSubject.asObservable();
}

class MockModalService {
  openEditForm = jasmine.createSpy('openEditForm');
  openDeleteModal = jasmine.createSpy('openDeleteModal');
}

describe('TaskDataTableComponent', () => {
  let component: TaskDataTableComponent;
  let fixture: ComponentFixture<TaskDataTableComponent>;
  let taskService: MockTaskService;
  let modalService: MockModalService;

  const mockTasks: Task[] = [
    {
      id: '1',
      assignedTo: 'John',
      status: 'Open',
      priority: 'High',
      dueDate: '2025-01-01',
      comments: 'Test task 1'
    },
    {
      id: '2',
      assignedTo: 'Jane',
      status: 'Closed',
      priority: 'Low',
      dueDate: '2025-02-01',
      comments: 'Test task 2'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDataTableComponent],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: ModalService, useClass: MockModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDataTableComponent);
    component = fixture.componentInstance;

    taskService = TestBed.inject(TaskService) as any;
    modalService = TestBed.inject(ModalService) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render rows for tasks', () => {
    taskService.pagedTasksSubject.next(mockTasks);
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
  });

  it('should highlight the correct row', () => {
    taskService.pagedTasksSubject.next(mockTasks);
    taskService.highlightedTaskIdSubject.next('2');

    fixture.detectChanges();

    const highlightedRow = fixture.debugElement.query(
      By.css('tr.highlight-row')
    );

    expect(highlightedRow).toBeTruthy();
    expect(highlightedRow.nativeElement.textContent).toContain('Jane');
  });

  it('should open action menu on button click', () => {
    taskService.pagedTasksSubject.next(mockTasks);
    fixture.detectChanges();

    const menuButton = fixture.debugElement.query(
      By.css('tbody tr button')
    );

    menuButton.triggerEventHandler('click', {
      stopPropagation: () => { },
      currentTarget: menuButton.nativeElement
    });

    expect(component.showMenu).toBeTrue();
    expect(component.selectedTask?.id).toBe('1');
  });

  it('should call openEditForm when clicking Edit', () => {
    component.selectedTask = mockTasks[0];
    component.showMenu = true;

    component.editTask(mockTasks[0]);

    expect(modalService.openEditForm).toHaveBeenCalledWith(mockTasks[0]);
    expect(component.showMenu).toBeFalse();
  });

  it('should call openDeleteModal when clicking Delete', () => {
    component.selectedTask = mockTasks[0];
    component.showMenu = true;

    component.deleteTask(mockTasks[0]);

    expect(modalService.openDeleteModal).toHaveBeenCalledWith(mockTasks[0]);
    expect(component.showMenu).toBeFalse();
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = spyOn<any>(component['destroy$'], 'next');
    const completeSpy = spyOn<any>(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
