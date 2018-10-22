import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ArticleService } from '../../../../services/article.service';
import { Subscription } from 'rxjs';
import { Article } from '../../../../Models/Article';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/auditTime';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd';
import { SystemSettingsService } from '../../../../services/system-settings.service';
import { CanDeactivateGuard } from '../../../../guard/can-deactivate.guard';
import { NzModalService } from 'ng-zorro-antd';
import { ElectronService } from '../../../../services/electron.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy, CanDeactivateGuard {

  @ViewChild('editorContent') editorContent: any;
  @ViewChild('editorInfo') editorInfo: any;

  public article: Article = {} as Article;
  public title: string;
  public date: moment.Moment;
  public isEditorChanged = false;

  private _routeSubscription: Subscription;

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
    private electronService: ElectronService,
    private systemSettingsService: SystemSettingsService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    this._routeSubscription = this.route.params
      .switchMap(params => {
        return this.articleService.articles$
          .map(posts => posts.find(post =>  post._id === params.id));
      })
      .map((article) => {
        if (!article) {
          this.router.navigate(['/dashboard/post']);
          return ;
        }
        this.article = article;

        this.isEditorChanged = false;

        return article;
      })
      .subscribe(() => {});

  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

  canDeactivate() {
    if ( this.isEditorChanged ) {
      return this.modalService.confirm({
        nzTitle   : 'YOU HAVE CHANGED SOME THINK',
        nzContent : 'DO YOU WANT SURE TO LEAVE THIS PAGE?',
        nzOnOk    : () => true,
      }).afterClose;
    } else {
      return true;
    }
  }
}
