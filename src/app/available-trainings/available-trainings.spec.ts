import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableTrainings } from './available-trainings';

describe('AvailableTrainings', () => {
  let component: AvailableTrainings;
  let fixture: ComponentFixture<AvailableTrainings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableTrainings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableTrainings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
