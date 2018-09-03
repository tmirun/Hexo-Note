import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemanePostModalComponent } from './remane-post-modal.component';

describe('RemanePostModalComponent', () => {
  let component: RemanePostModalComponent;
  let fixture: ComponentFixture<RemanePostModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemanePostModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemanePostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
