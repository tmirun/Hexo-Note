import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Article } from '../../Models/Article';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-new-post-form',
  templateUrl: './new-post-form.component.html',
  styleUrls: ['./new-post-form.component.scss']
})
export class NewPostFormComponent implements OnInit, OnDestroy {

  @Input() post: Article;
  @Output() postChange = new EventEmitter<Article>();

  public form: FormGroup;
  private formSubscription: Subscription;
  private formTitleChangeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private modalService: NzModalService,
    private message: NzMessageService
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
        const isTitleExist = this.postService.checkIfExistPost(title);
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
    this.formSubscription.unsubscribe();
  }

  public onSubmit() {
    for (const i in this.form.controls) {
      if (this.form.controls) {
        this.form.controls[ i ].markAsDirty();
        this.form.controls[ i ].updateValueAndValidity();
      }
    }
    this.postService.create({
      title: this.form.value.title,
      published: this.form.value.published
    }).then(() => {
      this.message.success('CREATE POST OK');
      this.modalService.closeAll();
    });
  }
}
