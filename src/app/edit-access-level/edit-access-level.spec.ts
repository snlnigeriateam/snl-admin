import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccessLevel } from './edit-access-level';

describe('EditAccessLevel', () => {
  let component: EditAccessLevel;
  let fixture: ComponentFixture<EditAccessLevel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAccessLevel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAccessLevel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
