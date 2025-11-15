import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuralDonaciones } from './mural-donaciones';

describe('MuralDonaciones', () => {
  let component: MuralDonaciones;
  let fixture: ComponentFixture<MuralDonaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuralDonaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuralDonaciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
