import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDirectReport } from './manage-direct-report';

describe('ManageDirectReport', () => {
  let component: ManageDirectReport;
  let fixture: ComponentFixture<ManageDirectReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDirectReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDirectReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
