import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationPageComponent } from './calculation-page.component';

describe('CalculationPageComponent', () => {
  let component: CalculationPageComponent;
  let fixture: ComponentFixture<CalculationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
