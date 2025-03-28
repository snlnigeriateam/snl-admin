import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeTrainingComponent } from './take-training.component';

describe('TakeTrainingComponent', () => {
  let component: TakeTrainingComponent;
  let fixture: ComponentFixture<TakeTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TakeTrainingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TakeTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
