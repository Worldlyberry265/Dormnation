import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerSelectionComponent } from './partner-selection.component';

describe('PartnerSelectionComponent', () => {
  let component: PartnerSelectionComponent;
  let fixture: ComponentFixture<PartnerSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
