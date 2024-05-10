import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterYourPropertyComponent } from './register-your-property.component';

describe('RegisterYourPropertyComponent', () => {
  let component: RegisterYourPropertyComponent;
  let fixture: ComponentFixture<RegisterYourPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterYourPropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterYourPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
