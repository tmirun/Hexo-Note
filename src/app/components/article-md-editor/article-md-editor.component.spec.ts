import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleMdEditorComponent } from './article-md-editor.component';

describe('ArticleMdEditorComponent', () => {
  let component: ArticleMdEditorComponent;
  let fixture: ComponentFixture<ArticleMdEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleMdEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleMdEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
