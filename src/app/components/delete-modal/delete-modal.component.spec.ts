import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteModalComponent } from './delete-modal.component';
import { ModalService } from '../../services/modal.service';
import { TaskService } from '../../services/task.service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Task } from '../../models/task.model';

describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<DeleteModalComponent>;

  let modalServiceMock: jasmine.SpyObj<ModalService>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let selectedTaskSubject: BehaviorSubject<Task | null>;

  const mockTask: Task = {
    id: '1',
    assignedTo: 'John',
    status: 'Open',
    priority: 'High',
    dueDate: '2025-01-01',
    comments: 'Test task'
  };

  beforeEach(async () => {
    selectedTaskSubject = new BehaviorSubject<Task | null>(null);

    modalServiceMock = jasmine.createSpyObj('ModalService', ['close'], {
      selectedTask$: selectedTaskSubject.asObservable()
    });

    taskServiceMock = jasmine.createSpyObj('TaskService', ['deleteTask']);

    await TestBed.configureTestingModule({
      imports: [DeleteModalComponent],
      providers: [
        { provide: ModalService, useValue: modalServiceMock },
        { provide: TaskService, useValue: taskServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // BASIC
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // SUBSCRIPTION
  it('should receive selected task from ModalService', () => {
    selectedTaskSubject.next(mockTask);
    fixture.detectChanges();

    expect(component.task).toEqual(mockTask);
  });

  // TEMPLATE
  it('should display task assignedTo in confirmation text', () => {
    selectedTaskSubject.next(mockTask);

    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.slds-modal__content'));
    expect(content.nativeElement.textContent).toContain('John');
  });


  // CLOSE MODAL
  it('should close modal when clicking "No"', () => {
    const noButton = fixture.debugElement.query(
      By.css('.delete-footer .slds-button_neutral')
    );

    noButton.triggerEventHandler('click');
    expect(modalServiceMock.close).toHaveBeenCalled();
  });

  // CONFIRM DELETE
  it('should delete task and close modal when clicking "Yes"', () => {
    selectedTaskSubject.next(mockTask);
    fixture.detectChanges();

    const yesButton = fixture.debugElement.query(
      By.css('.delete-footer .slds-button_brand')
    );

    yesButton.triggerEventHandler('click');

    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith('1');
    expect(modalServiceMock.close).toHaveBeenCalled();
  });

  it('should NOT delete task if task is null', () => {
    component.task = null;

    component.confirmDelete();

    expect(taskServiceMock.deleteTask).not.toHaveBeenCalled();
    expect(modalServiceMock.close).not.toHaveBeenCalled();
  });

  // CLEANUP
  it('should complete destroy$ on ngOnDestroy', () => {
    const destroySpy = spyOn<any>(component['destroy$'], 'next');
    const completeSpy = spyOn<any>(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
