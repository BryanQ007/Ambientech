import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMostrarInfoMarcasComponent } from './modal-mostrar-info-marcas.component';

describe('ModalMostrarInfoMarcasComponent', () => {
  let component: ModalMostrarInfoMarcasComponent;
  let fixture: ComponentFixture<ModalMostrarInfoMarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMostrarInfoMarcasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMostrarInfoMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
