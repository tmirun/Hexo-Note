import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { Observable, Subscription } from 'rxjs';
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
import { NzMessageService } from 'ng-zorro-antd';
import { SystemSettingsService } from '../../../../services/system-settings.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public post: Post;
  public isNewPost = false;
  public title: string;
  public tags: string;
  public categories: string;
  public toc: boolean;
  public path: string;
  public date: moment.Moment;
  public isActivePreview = false;

  public routeSubscription: Subscription;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService,
    private systemSettingsService: SystemSettingsService
  ) {
    this.form = this.fb.group({
      raw:  [ '', [ Validators.required ] ]
    });

    this.isActivePreview = this.systemSettingsService.getIsActivePreview();
  }

  ngOnInit() {
    this.routeSubscription = this.route.params
      .switchMap(params => {
        return this.postService.articles$
          .map(posts => posts.find(post =>  post._id === params.id));
      })
      .subscribe((post) => {
        if (!post) {
          this.router.navigate(['/dashboard/post']);
          return ;
        }
        this.post = post;
        this.path = this.post.path;

        this.form.setValue({
          raw: this.post.raw || '',
        });
      });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  public publish() {
    const loadingMessageId = this.message.loading('SAVING').messageId;
    this.postService.publish(this.post)
      .then(() => this.message.success('SAVING OK'))
      .catch(() => this.message.error('SAVING ERROR'))
      .finally( () => this.message.remove(loadingMessageId));
  }

  public submitForm() {
    const loadingMessageId = this.message.loading('SAVING').messageId;
    if (!this.isNewPost) { this.isNewPost = true; }
    this.postService.update({
      ...this.post,
      raw: this.form.value.raw
    })
      .then(() => this.message.success('SAVING OK'))
      .catch(() => this.message.error('SAVING ERROR'))
      .finally( () => this.message.remove(loadingMessageId));
  }

  public onPreviewClick() {
    this.systemSettingsService.saveIsActivePreview(this.isActivePreview);
  }

}
