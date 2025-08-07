import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccessLevelComponent } from './edit-access-level.component';

describe('EditAccessLevelComponent', () => {
  let component: EditAccessLevelComponent;
  let fixture: ComponentFixture<EditAccessLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAccessLevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAccessLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
