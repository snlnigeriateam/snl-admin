import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDirectReportComponent } from './manage-direct-report.component';

describe('ManageDirectReportComponent', () => {
  let component: ManageDirectReportComponent;
  let fixture: ComponentFixture<ManageDirectReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageDirectReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageDirectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
