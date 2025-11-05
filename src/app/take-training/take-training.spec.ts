import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeTraining } from './take-training';

describe('TakeTraining', () => {
  let component: TakeTraining;
  let fixture: ComponentFixture<TakeTraining>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeTraining]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeTraining);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
