import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {PostService} from '../../services/post.service';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {Article} from '../../Models/Article';

@Component({
  selector: 'app-remane-post-modal',
  templateUrl: './remane-post-modal.component.html',
  styleUrls: ['./remane-post-modal.component.scss']
})
export class RemanePostModalComponent implements OnInit, OnDestroy {

  @Input() article: Article;
  @Input() subtitle: string;

  public isRenaming = false;
  public isSame = true;
  public form: FormGroup;
  private formFileNameChangeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private modal: NzModalRef
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      fileName: [ '', [ Validators.required ] ]
    });

    this.formFileNameChangeSubscription = this.form.controls['fileName']
      .valueChanges
      .debounceTime(300)
      .subscribe(fileName => {
        const isFileNameExist = this.postService.checkIfExistFileName(fileName);
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
    this.formFileNameChangeSubscription.unsubscribe();
  }

  public onSubmit() {
    this.isRenaming = true;

    // validate form
    for (const i in this.form.controls) {
      if (this.form.controls) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    this.postService.rename(this.article, this.form.value.fileName)
      .then(() => {
        this.isRenaming = false;
        this.message.success('RENAME ARTICLE OK');
        this.modalService.closeAll();
      })
      .catch((error) => {
        console.error('ERROR REMOVE ARTICLE', error);
        this.message.error('RENAME ARTICLE OK');
      });
  }
}
