import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { ModalService } from '../../services/modal.service';
import { TaskService } from '../../services/task.service';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../models/task.model';
import { ModalType } from '../../models/modal.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  let modalStateSubject: BehaviorSubject<ModalType>;
  let selectedTaskSubject: BehaviorSubject<Task | null>;

  let modalServiceMock: jasmine.SpyObj<ModalService>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;

  const mockTask: Task = {
    id: '1',
    assignedTo: 'Accounts',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2025-01-01',
    comments: 'Test comment'
  };

  beforeEach(async () => {
    modalStateSubject = new BehaviorSubject<ModalType>('addForm');
    selectedTaskSubject = new BehaviorSubject<Task | null>(null);

    modalServiceMock = jasmine.createSpyObj(
      'ModalService',
      ['close'],
      {
        modalState$: modalStateSubject.asObservable(),
        selectedTask$: selectedTaskSubject.asObservable()
      }
    );

    taskServiceMock = jasmine.createSpyObj('TaskService', [
      'addTask',
      'updateTask'
    ]);

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        { provide: ModalService, useValue: modalServiceMock },
        { provide: TaskService, useValue: taskServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show "New Task" title in add mode', () => {
    modalStateSubject.next('addForm');
    fixture.detectChanges();

    expect(component.modalType).toBe('addForm');
  });

  it('should populate form in edit mode', () => {
    modalStateSubject.next('editForm');
    selectedTaskSubject.next(mockTask);
    fixture.detectChanges();

    expect(component.selectedAssigned).toBe('Accounts');
    expect(component.selectedStatus).toBe('In Progress');
    expect(component.selectedPriority).toBe('High');
    expect(component.comment).toBe('Test comment');
  });

  it('should return false if form is invalid', () => {
    component.selectedAssigned = 'Select a User';
    component.selectedStatus = 'Select a User';
    component.selectedPriority = 'Select a User';

    expect(component.isFormValid).toBeFalse();
  });

  it('should return true if form is valid', () => {
    component.selectedAssigned = 'Accounts';
    component.selectedStatus = 'In Progress';
    component.selectedPriority = 'High';

    expect(component.isFormValid).toBeTrue();
  });

  it('should add task and close modal on submit in add mode', () => {
    component.selectedAssigned = 'Accounts';
    component.selectedStatus = 'Completed';
    component.selectedPriority = 'Low';
    component.comment = 'New task';

    component.submit();

    expect(taskServiceMock.addTask).toHaveBeenCalled();
    expect(modalServiceMock.close).toHaveBeenCalled();
  });

  it('should update task and close modal in edit mode', () => {
    modalStateSubject.next('editForm');
    selectedTaskSubject.next(mockTask);
    fixture.detectChanges();

    component.selectedStatus = 'Completed';

    component.submit();

    expect(taskServiceMock.updateTask).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: '1',
        status: 'Completed'
      })
    );

    expect(modalServiceMock.close).toHaveBeenCalled();
  });

  it('should reset form and close modal', () => {
    component.selectedAssigned = 'Accounts';

    component.closeModal();

    expect(component.selectedAssigned).toBe('Select a User');
    expect(modalServiceMock.close).toHaveBeenCalled();
  });

  it('should toggle assigned dropdown', () => {
    component.toggleAssigned();
    expect(component.isAssignedOpen).toBeTrue();

    component.toggleAssigned();
    expect(component.isAssignedOpen).toBeFalse();
  });

  it('should toggle status dropdown', () => {
    component.toggleStatus();
    expect(component.isStatusOpen).toBeTrue();

    component.toggleStatus();
    expect(component.isStatusOpen).toBeFalse();
  });

  it('should toggle priority dropdown', () => {
    component.togglePriority();
    expect(component.isPriorityOpen).toBeTrue();

    component.togglePriority();
    expect(component.isPriorityOpen).toBeFalse();
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = spyOn<any>(component['destroy$'], 'next');
    const completeSpy = spyOn<any>(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
