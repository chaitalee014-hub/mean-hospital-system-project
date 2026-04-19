import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Checkup } from './checkup';

describe('Checkup', () => {
  let component: Checkup;
  let fixture: ComponentFixture<Checkup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Checkup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
