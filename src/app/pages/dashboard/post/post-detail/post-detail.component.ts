import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { Subscription } from 'rxjs';
import { Post } from '../../../../Models/Post.interface';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public post: Post;
  public raw: string;
  public title: string;
  public tags: string;
  public categories: string;
  public toc: boolean;
  public path: string;
  public date: moment.Moment;

  public routeSubscription: Subscription;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      raw:  [ this.raw, [ Validators.required ] ]
    });
  }

  ngOnInit() {
    this.routeSubscription = this.route.params
      .switchMap(params => {
        return this.postService.posts$
          .map(posts => posts.find(post =>  post._id === params.id));
      })
      .subscribe((post) => {
        if (!post) {
          this.router.navigate(['/dashboard/post']);
          return ;
        }
        this.post = post;
        this.raw = this.post.raw;
        this.path = this.post.path;

        this.form.setValue({
          raw: this.raw,
        });
      });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  submitForm() {
    // this.postService.update(this.post.path);
  }

}
