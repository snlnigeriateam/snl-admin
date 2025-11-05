import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccessLevel } from './create-access-level';

describe('CreateAccessLevel', () => {
  let component: CreateAccessLevel;
  let fixture: ComponentFixture<CreateAccessLevel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccessLevel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccessLevel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
