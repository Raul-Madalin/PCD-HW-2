import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDetailsComponent } from './error-details.component';

describe('ErrorDetailsComponent', () => {
  let component: ErrorDetailsComponent;
  let fixture: ComponentFixture<ErrorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
