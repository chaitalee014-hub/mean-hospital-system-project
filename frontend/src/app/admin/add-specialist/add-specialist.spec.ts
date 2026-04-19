import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpecialist } from './add-specialist';

describe('AddSpecialist', () => {
  let component: AddSpecialist;
  let fixture: ComponentFixture<AddSpecialist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSpecialist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSpecialist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
