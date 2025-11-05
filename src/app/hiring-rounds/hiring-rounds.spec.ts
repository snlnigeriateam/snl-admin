import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringRounds } from './hiring-rounds';

describe('HiringRounds', () => {
  let component: HiringRounds;
  let fixture: ComponentFixture<HiringRounds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringRounds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiringRounds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
