import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoEvento } from './nuevo-evento';

describe('NuevoEvento', () => {
  let component: NuevoEvento;
  let fixture: ComponentFixture<NuevoEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoEvento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoEvento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
