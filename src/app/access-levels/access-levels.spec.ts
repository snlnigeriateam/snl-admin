import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessLevels } from './access-levels';

describe('AccessLevels', () => {
  let component: AccessLevels;
  let fixture: ComponentFixture<AccessLevels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessLevels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessLevels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
