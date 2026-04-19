import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Specialists } from './specialists';

describe('Specialists', () => {
  let component: Specialists;
  let fixture: ComponentFixture<Specialists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Specialists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Specialists);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
