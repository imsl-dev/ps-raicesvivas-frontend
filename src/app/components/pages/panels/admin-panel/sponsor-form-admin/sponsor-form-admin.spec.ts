import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorFormAdmin } from './sponsor-form-admin';

describe('SponsorFormAdmin', () => {
  let component: SponsorFormAdmin;
  let fixture: ComponentFixture<SponsorFormAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorFormAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsorFormAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
