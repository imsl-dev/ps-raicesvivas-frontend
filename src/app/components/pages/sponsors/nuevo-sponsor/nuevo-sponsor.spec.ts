import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoSponsor } from './nuevo-sponsor';

describe('NuevoSponsor', () => {
  let component: NuevoSponsor;
  let fixture: ComponentFixture<NuevoSponsor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoSponsor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoSponsor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
