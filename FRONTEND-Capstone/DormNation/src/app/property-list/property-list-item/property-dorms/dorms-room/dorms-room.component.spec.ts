import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormsRoomComponent } from './dorms-room.component';

describe('DormsRoomComponent', () => {
  let component: DormsRoomComponent;
  let fixture: ComponentFixture<DormsRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DormsRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DormsRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
