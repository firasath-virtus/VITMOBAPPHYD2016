import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpDetailsComponent } from './follow-up-details.component';

describe('FollowUpDetailsComponent', () => {
  let component: FollowUpDetailsComponent;
  let fixture: ComponentFixture<FollowUpDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
