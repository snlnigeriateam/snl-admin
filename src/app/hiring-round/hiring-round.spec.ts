import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringRound } from './hiring-round';

describe('HiringRound', () => {
  let component: HiringRound;
  let fixture: ComponentFixture<HiringRound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringRound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiringRound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
