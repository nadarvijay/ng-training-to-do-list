import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TaskService } from '../../services/task.service';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

class MockTaskService {
  tasksSubject = new BehaviorSubject<any[]>([]);

  tasks$ = this.tasksSubject.asObservable();

  resetState = jasmine.createSpy('resetState');
}

class MockModalService {
  openAddForm = jasmine.createSpy('openAddForm');
}


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let taskService: MockTaskService;
  let modalService: MockModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: ModalService, useClass: MockModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    taskService = TestBed.inject(TaskService) as any;
    modalService = TestBed.inject(ModalService) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display records count', () => {
    taskService.tasksSubject.next([{ id: 1 }, { id: 2 }, { id: 3 }]);

    fixture.detectChanges();

    const countEl = fixture.debugElement.query(
      By.css('.records-count')
    );

    expect(countEl.nativeElement.textContent.trim()).toBe('3 records');
  });

  it('should open create task modal on "New Task" click', () => {
    const newTaskBtn = fixture.debugElement.query(
      By.css('button.slds-button_first')
    );

    newTaskBtn.nativeElement.click();

    expect(modalService.openAddForm).toHaveBeenCalled();
  });

  it('should reset task state on refresh click', () => {
    const refreshBtn = fixture.debugElement.query(
      By.css('button.slds-button_last')
    );

    refreshBtn.nativeElement.click();

    expect(taskService.resetState).toHaveBeenCalled();
  });
});
