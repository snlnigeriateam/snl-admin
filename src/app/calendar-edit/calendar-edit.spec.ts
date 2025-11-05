import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEdit } from './calendar-edit';

describe('CalendarEdit', () => {
  let component: CalendarEdit;
  let fixture: ComponentFixture<CalendarEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
