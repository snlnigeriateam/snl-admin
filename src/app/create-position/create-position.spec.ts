import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePosition } from './create-position';

describe('CreatePosition', () => {
  let component: CreatePosition;
  let fixture: ComponentFixture<CreatePosition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePosition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePosition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
