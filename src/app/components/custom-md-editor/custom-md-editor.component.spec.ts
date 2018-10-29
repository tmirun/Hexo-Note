import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMdEditorComponent } from './custom-md-editor.component';

describe('CustomMdEditorComponent', () => {
  let component: CustomMdEditorComponent;
  let fixture: ComponentFixture<CustomMdEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomMdEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMdEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
