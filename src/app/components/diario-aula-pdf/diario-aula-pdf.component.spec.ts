import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioAulaPdfComponent } from './diario-aula-pdf.component';

describe('DiarioAulaPdfComponent', () => {
  let component: DiarioAulaPdfComponent;
  let fixture: ComponentFixture<DiarioAulaPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiarioAulaPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiarioAulaPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
