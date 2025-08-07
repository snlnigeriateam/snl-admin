import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccessLevelComponent } from './create-access-level.component';

describe('CreateAccessLevelComponent', () => {
  let component: CreateAccessLevelComponent;
  let fixture: ComponentFixture<CreateAccessLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAccessLevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAccessLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
