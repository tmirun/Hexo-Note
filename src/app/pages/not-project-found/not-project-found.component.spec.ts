import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotProjectFoundComponent } from './not-project-found.component';

describe('NotProjectFoundComponent', () => {
  let component: NotProjectFoundComponent;
  let fixture: ComponentFixture<NotProjectFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotProjectFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotProjectFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
