import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDataTableComponent } from './task-data-table.component';

describe('TaskDataTableComponent', () => {
  let component: TaskDataTableComponent;
  let fixture: ComponentFixture<TaskDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
