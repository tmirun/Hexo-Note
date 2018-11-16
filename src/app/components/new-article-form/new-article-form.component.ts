import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Article } from '../../Models/Article';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-article-form',
  templateUrl: './new-article-form.component.html',
  styleUrls: ['./new-article-form.component.scss']
})
export class NewArticleFormComponent implements OnInit, OnDestroy {

  @Input() post: Article;
  @Output() postChange = new EventEmitter<Article>();

  public isCreating = false;
  public form: FormGroup;
  private formSubscription: Subscription;
  private formTitleChangeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private modal: NzModalRef,
    private message: NzMessageService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: [ '', [ Validators.required ] ],
      published: [ false, [ Validators.required ] ]
    });
  }

  ngOnInit() {
    this.formTitleChangeSubscription = this.form.controls['title']
      .valueChanges
      .debounceTime(300)
      .subscribe(title => {
        const isTitleExist = this.articleService.checkIfExistFileName(title);
        if (isTitleExist) {
          this.form.controls['title'].setErrors( {'exist': true});
        } else if (!this.form.controls['title'].errors) {
          this.form.controls['title'].setErrors( null);
        }
      });

    this.formSubscription = this.form.valueChanges
      .subscribe(value => {
        this.postChange.emit(value);
      });
  }

  ngOnDestroy() {
    this.formTitleChangeSubscription.unsubscribe();
    this.formSubscription.unsubscribe();
  }

  public onSubmit() {
    this.isCreating = true;

    // validate form
    for (const i in this.form.controls) {
      if (this.form.controls[i]) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }

    const title = this.form.value.title;
    const published = this.form.value.published;

    this.articleService.create({ title, published})
      .then(() => {
        this.isCreating = false;
        this.message.success('CREATE POST OK');
        this.articleService.articles$
          .debounceTime(500)
          .take(1)
          .toPromise()
          .then(() => {
            const currentArticle = this.articleService.getArticleByLocalByTitle(title);
            this.router.navigate(['/dashboard', 'article', Article.generateId(currentArticle.file, published)]);
            this.modal.close();
          });
      })
      .catch((err) => {
        this.message.error(`CREATE POST ERROR: ${err}`);
      });
  }
}
