import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioAulaComponent } from './diario-aula.component';

describe('DiarioAulaComponent', () => {
  let component: DiarioAulaComponent;
  let fixture: ComponentFixture<DiarioAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiarioAulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiarioAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
