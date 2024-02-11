import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartHiringRoundComponent } from './start-hiring-round.component';

describe('StartHiringRoundComponent', () => {
  let component: StartHiringRoundComponent;
  let fixture: ComponentFixture<StartHiringRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartHiringRoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartHiringRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
