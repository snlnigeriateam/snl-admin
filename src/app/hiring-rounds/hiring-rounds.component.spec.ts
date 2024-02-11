import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringRoundsComponent } from './hiring-rounds.component';

describe('HiringRoundsComponent', () => {
  let component: HiringRoundsComponent;
  let fixture: ComponentFixture<HiringRoundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HiringRoundsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HiringRoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
