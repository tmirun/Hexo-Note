import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { CanDeactivateGuard } from '../../../../guard/can-deactivate.guard';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy, CanDeactivateGuard {

  @ViewChild('editor') editor: any;

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
  public isEditorChanged = false;
  public codeMirrorOptions = {
    theme: 'material',
    mode: 'markdown',
    lineWrapping: true,
    lineNumbers: true
  };

  public routeSubscription: Subscription;
  public formSubscription: Subscription;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService,
    private systemSettingsService: SystemSettingsService,
    private modalService: NzModalService
  ) {
    this.form = this.fb.group({
      raw:  [ '', [ Validators.required ] ]
    });

    this.formSubscription = this.form.valueChanges.subscribe(() => {
      this.isEditorChanged = true;
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

        this.isEditorChanged = false;
      });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.formSubscription.unsubscribe();
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

  public publish() {
    const loadingMessageId = this.message.loading('PUBLISH').messageId;
    this.postService.publish(this.post)
      .then(() => this.message.success('PUBLISH OK'))
      .catch(() => this.message.error('PUBLISH ERROR'))
      .finally( () => this.message.remove(loadingMessageId));
  }

  public submitForm() {
    const loadingMessageId = this.message.loading('SAVING').messageId;
    if (!this.isNewPost) { this.isNewPost = true; }
    this.postService.update({
      ...this.post,
      raw: this.form.value.raw
    })
      .then(() => {
        this.message.success('SAVING OK');
        this.isEditorChanged = false;
      })
      .catch(() => this.message.error('SAVING ERROR'))
      .finally( () => this.message.remove(loadingMessageId));
  }

  public onPreviewClick() {
    this.systemSettingsService.saveIsActivePreview(this.isActivePreview);
  }

  public replaceSelection(type) {
    const selectedText = this.editor.codeMirror.getSelection() || 'someValue';
    let resultText = '';
    switch (type) {
      case 'bold':
        resultText = `**${selectedText}**`; break;
      case 'italic':
        resultText = `*${selectedText}*`; break;
      case 'strikeThrough':
        resultText = `~~${selectedText}~~`; break;
      case 'heading1':
        resultText = `# ${selectedText}`; break;
      case 'heading2':
        resultText = `## ${selectedText}`; break;
      case 'heading3':
        resultText = `### ${selectedText}`; break;
      case 'heading4':
        resultText = `#### ${selectedText}`; break;
      case 'heading5':
        resultText = `###### ${selectedText}`; break;
      case 'heading6':
        resultText = `####### ${selectedText}`; break;
      case 'code':
        resultText = '\n``` language\n' + selectedText + '\n```\n'; break;
      case 'quote':
        resultText = `> ${selectedText}`; break;
      case 'unorderedList':
        resultText = `- ${selectedText}`; break;
      case 'orderedList':
        resultText = `1. ${selectedText}`; break;
      case 'link':
        if (this._isURL(selectedText)) {
          resultText = `[](${selectedText})`;
        } else {
          resultText = `[${selectedText}](https://)`;
        }
        break;
      case 'image':
        resultText = `![](${selectedText})`; break;
      case 'table':
        resultText =
        '\nheader1 | header2 | header3\n' +
        '--- | --- | ---\n' +
        'text1 | text2 | text3\n'; break;
      case 'horizontalRule':
        resultText = `---`; break;
      case 'readMore':
        resultText = '\n<!-- more -->\n'; break;
    }

    this.editor.codeMirror.replaceSelection(resultText, 'end');
    this.editor.codeMirror.focus();
  }


  private _isURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
  }
}
