import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveArticleImageModalComponent } from './save-article-image-modal.component';

describe('SaveArticleImageModalComponent', () => {
  let component: SaveArticleImageModalComponent;
  let fixture: ComponentFixture<SaveArticleImageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveArticleImageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveArticleImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
