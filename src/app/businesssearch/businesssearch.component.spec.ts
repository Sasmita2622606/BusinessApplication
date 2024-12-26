import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinesssearchComponent } from './businesssearch.component';

describe('BusinesssearchComponent', () => {
  let component: BusinesssearchComponent;
  let fixture: ComponentFixture<BusinesssearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinesssearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinesssearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
