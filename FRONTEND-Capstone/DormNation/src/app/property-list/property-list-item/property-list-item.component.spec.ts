import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyListItemComponent } from './property-list-item.component';

describe('PropertyListItemComponent', () => {
  let component: PropertyListItemComponent;
  let fixture: ComponentFixture<PropertyListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
