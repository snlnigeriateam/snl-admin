import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartHiringRound } from './start-hiring-round';

describe('StartHiringRound', () => {
  let component: StartHiringRound;
  let fixture: ComponentFixture<StartHiringRound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartHiringRound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartHiringRound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
