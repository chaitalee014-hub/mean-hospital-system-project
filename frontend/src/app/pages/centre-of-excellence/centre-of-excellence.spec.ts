import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreOfExcellence } from './centre-of-excellence';

describe('CentreOfExcellence', () => {
  let component: CentreOfExcellence;
  let fixture: ComponentFixture<CentreOfExcellence>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentreOfExcellence]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentreOfExcellence);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
