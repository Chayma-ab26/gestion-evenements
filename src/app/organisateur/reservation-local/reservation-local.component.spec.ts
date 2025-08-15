import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationLocalComponent } from './reservation-local.component';

describe('ReservationLocalComponent', () => {
  let component: ReservationLocalComponent;
  let fixture: ComponentFixture<ReservationLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationLocalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
