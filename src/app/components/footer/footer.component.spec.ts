import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { TaskService } from '../../services/task.service';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

class MockTaskService {
  // Subjects we control
  totalPagesSubject = new BehaviorSubject<number>(1);
  currentPageSubject = new BehaviorSubject<number>(1);
  pageSizeSubject = new BehaviorSubject<number>(10);

  // Exposed observables (read-only)
  totalPages$ = this.totalPagesSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();
  pageSize$ = this.pageSizeSubject.asObservable();

  // Spy methods
  setPageSize = jasmine.createSpy('setPageSize');
  goToFirst = jasmine.createSpy('goToFirst');
  prevPage = jasmine.createSpy('prevPage');
  nextPage = jasmine.createSpy('nextPage');
  goToLast = jasmine.createSpy('goToLast');
}


describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let taskService: MockTaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [{ provide: TaskService, useClass: MockTaskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable first & prev on first page', () => {
    taskService.currentPageSubject.next(1);
    taskService.totalPagesSubject.next(5);

    fixture.detectChanges();

    expect(component.isFirstPage).toBeTrue();
    expect(component.isLastPage).toBeFalse();
  });

  it('should disable next & last on last page', () => {
    taskService.currentPageSubject.next(5);
    taskService.totalPagesSubject.next(5);

    fixture.detectChanges();

    expect(component.isLastPage).toBeTrue();
    expect(component.isFirstPage).toBeFalse();
  });

  it('should display current page', () => {
    taskService.currentPageSubject.next(3);

    fixture.detectChanges();

    const pageIndicator = fixture.debugElement.query(
      By.css('.page-indicator')
    );

    expect(pageIndicator.nativeElement.textContent.trim()).toBe('3');
  });

  it('should call setPageSize when dropdown changes', () => {
    const select = fixture.debugElement.query(By.css('select'));

    select.nativeElement.value = '20';
    select.nativeElement.dispatchEvent(new Event('change'));

    expect(taskService.setPageSize).toHaveBeenCalledWith(20);
  });

  it('should call goToFirst()', () => {
    component.first();
    expect(taskService.goToFirst).toHaveBeenCalled();
  });

  it('should call prevPage()', () => {
    component.prev();
    expect(taskService.prevPage).toHaveBeenCalled();
  });

  it('should call nextPage with totalPages', () => {
    taskService.totalPagesSubject.next(4);
    fixture.detectChanges();

    component.next();

    expect(taskService.nextPage).toHaveBeenCalledWith(4);
  });

  it('should call goToLast with totalPages', () => {
    taskService.totalPagesSubject.next(6);
    fixture.detectChanges();

    component.last();

    expect(taskService.goToLast).toHaveBeenCalledWith(6);
  });
});
