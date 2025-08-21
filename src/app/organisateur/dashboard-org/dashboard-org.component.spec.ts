import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DachboardOrgComponent } from './dashboard-org.component';

describe('DachboardOrgComponent', () => {
  let component: DachboardOrgComponent;
  let fixture: ComponentFixture<DachboardOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DachboardOrgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DachboardOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
