import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTrainings } from './manage-trainings';

describe('ManageTrainings', () => {
  let component: ManageTrainings;
  let fixture: ComponentFixture<ManageTrainings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTrainings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTrainings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
