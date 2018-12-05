import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameArticleModalComponent } from './rename-article-modal.component';

describe('RenameArticleModalComponent', () => {
  let component: RenameArticleModalComponent;
  let fixture: ComponentFixture<RenameArticleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameArticleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameArticleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
