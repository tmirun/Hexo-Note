import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Post } from '../../Models/Post.interface';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';

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
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: [ '', [ Validators.required ] ],
      published: [ false, [ Validators.required ] ]
    });
  }

  ngOnInit() {
    this.formSubscription = this.form.valueChanges.subscribe(value => {
      console.log(value);
      this.postChange.emit(value);
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

}
