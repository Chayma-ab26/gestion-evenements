import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDshboardComponent } from './participant-dashboard.component';

describe('ParticipantDshboardComponent', () => {
  let component: ParticipantDshboardComponent;
  let fixture: ComponentFixture<ParticipantDshboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantDshboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantDshboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
