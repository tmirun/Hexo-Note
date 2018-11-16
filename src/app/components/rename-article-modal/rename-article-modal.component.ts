import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ArticleService} from '../../services/article.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {Article} from '../../Models/Article';

@Component({
  selector: 'app-rename-article-modal',
  templateUrl: './rename-article-modal.component.html',
  styleUrls: ['./rename-article-modal.component.scss']
})
export class RenameArticleModalComponent implements OnInit, OnDestroy {

  @Input() article: Article;
  @Input() subtitle: string;

  public isRenaming = false;
  public isSame = true;
  public form: FormGroup;
  private _formFileNameChangeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private message: NzMessageService,
    private modal: NzModalRef
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      fileName: [ '', [ Validators.required ] ]
    });

    this._formFileNameChangeSubscription = this.form.controls['fileName']
      .valueChanges
      .debounceTime(300)
      .subscribe(fileName => {
        const isFileNameExist = this.articleService.checkIfExistFileName(fileName);
        if (isFileNameExist) {
          this.form.controls['fileName'].setErrors( {'exist': true});
        } else if (!this.form.controls['fileName'].errors) {
          this.form.controls['fileName'].setErrors( null);
        }
      });

    this.form.setValue({
      fileName: this.article.fileName
    });
  }

  ngOnDestroy() {
    this._formFileNameChangeSubscription.unsubscribe();
  }

  public onSubmit() {
    this.isRenaming = true;

    // validate form
    for (const i in this.form.controls) {
      if (this.form.controls[i]) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    this.articleService.rename(this.article, this.form.value.fileName)
      .then(() => {
        this.isRenaming = false;
        this.message.success('RENAME ARTICLE OK');
        this.modal.close();
      })
      .catch((err) => {
        this.message.error(`RENAME ARTICLE ERROR: ${err}`);
      });
  }
}
