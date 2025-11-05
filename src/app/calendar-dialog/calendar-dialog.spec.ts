import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDialog } from './calendar-dialog';

describe('CalendarDialog', () => {
  let component: CalendarDialog;
  let fixture: ComponentFixture<CalendarDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
