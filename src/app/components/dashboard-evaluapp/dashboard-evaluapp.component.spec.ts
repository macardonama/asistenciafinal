import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEvaluappComponent } from './dashboard-evaluapp.component';

describe('DashboardEvaluappComponent', () => {
  let component: DashboardEvaluappComponent;
  let fixture: ComponentFixture<DashboardEvaluappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEvaluappComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEvaluappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
