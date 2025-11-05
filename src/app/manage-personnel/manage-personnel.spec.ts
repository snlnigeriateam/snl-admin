import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePersonnel } from './manage-personnel';

describe('ManagePersonnel', () => {
  let component: ManagePersonnel;
  let fixture: ComponentFixture<ManagePersonnel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePersonnel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePersonnel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
