import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDormsComponent } from './property-dorms.component';

describe('PropertyDormsComponent', () => {
  let component: PropertyDormsComponent;
  let fixture: ComponentFixture<PropertyDormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyDormsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyDormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
