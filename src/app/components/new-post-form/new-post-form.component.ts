import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Post } from '../../Models/Post.interface';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-new-post-form',
  templateUrl: './new-post-form.component.html',
  styleUrls: ['./new-post-form.component.scss']
})
export class NewPostFormComponent implements OnInit, OnDestroy {

  @Input() post: Post;
  @Output() postChange = new EventEmitter<Post>();

  public form: FormGroup;
  private formSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private modalService: NzModalService
  ) {
    this.form = this.fb.group({
      title: [ '', [ Validators.required ] ],
      published: [ false, [ Validators.required ] ]
    });
  }

  ngOnInit() {
    this.formSubscription = this.form.valueChanges.subscribe(value => {
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
      layout: this.form.value.published ? 'post' : 'draft'
    }).then(() => {
      this.modalService.closeAll();
    });
  }
}
