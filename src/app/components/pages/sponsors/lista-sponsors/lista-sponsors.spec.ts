import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSponsors } from './lista-sponsors';

describe('ListaSponsors', () => {
  let component: ListaSponsors;
  let fixture: ComponentFixture<ListaSponsors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaSponsors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaSponsors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
