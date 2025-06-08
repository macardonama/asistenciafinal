import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesasVidasComponent } from './mesas-vidas.component';

describe('MesasVidasComponent', () => {
  let component: MesasVidasComponent;
  let fixture: ComponentFixture<MesasVidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesasVidasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesasVidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
