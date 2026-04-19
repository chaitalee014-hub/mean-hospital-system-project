import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistsComponent } from './specialists-component';

describe('SpecialistsComponent', () => {
  let component: SpecialistsComponent;
  let fixture: ComponentFixture<SpecialistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialistsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
