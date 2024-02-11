import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringRoundComponent } from './hiring-round.component';

describe('HiringRoundComponent', () => {
  let component: HiringRoundComponent;
  let fixture: ComponentFixture<HiringRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HiringRoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HiringRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
