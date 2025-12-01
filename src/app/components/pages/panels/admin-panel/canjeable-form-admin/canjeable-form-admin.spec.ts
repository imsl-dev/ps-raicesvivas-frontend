import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanjeableFormAdmin } from './canjeable-form-admin';

describe('CanjeableFormAdmin', () => {
  let component: CanjeableFormAdmin;
  let fixture: ComponentFixture<CanjeableFormAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanjeableFormAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanjeableFormAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
