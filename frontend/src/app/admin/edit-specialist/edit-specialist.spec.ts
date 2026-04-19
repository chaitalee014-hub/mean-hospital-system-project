import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecialist } from './edit-specialist';

describe('EditSpecialist', () => {
  let component: EditSpecialist;
  let fixture: ComponentFixture<EditSpecialist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSpecialist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSpecialist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
