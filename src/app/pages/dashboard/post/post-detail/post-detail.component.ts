import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { Subscription } from 'rxjs';
import { Article } from '../../../../Models/Article';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/auditTime';
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
import { ConfigService } from '../../../../services/config.service';
import { UtilsService } from '../../../../services/utils.service';
import { ElectronService } from '../../../../services/electron.service';
import { SaveArticleImageModalComponent } from '../../../../components/save-article-image-modal/save-article-image-modal.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy, CanDeactivateGuard {

  @ViewChild('editorContent') editorContent: any;

  public form: FormGroup;
  public article: Article = {} as Article;
  public isNewPost = false;
  public title: string;
  public date: moment.Moment;
  public isActivePreview = false;
  public isEditorChanged = false;
  public codeMirrorOptions = {
    theme: 'hexo-note',
    mode: 'markdown',
    lineWrapping: true,
    lineNumbers: false
  };
  public isSaving = false;
  public isPublishing = false;
  public disablePostAsset = true;
  public needPostAssetFolderActiveText = 'Need Active post_asset_folder property of config file for enble this option';

  private _routeSubscription: Subscription;
  private _formSubscription: Subscription;
  private _configSubscription: Subscription;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService,
    private electronService: ElectronService,
    private systemSettingsService: SystemSettingsService,
    private modalService: NzModalService,
    private configService: ConfigService,
    private utilsService: UtilsService
  ) {
    this.form = this.fb.group({
      info:  [ '', [ Validators.required ] ],
      content:  [ '', [ Validators.required ] ]
    });

    this._formSubscription = this.form.valueChanges.subscribe(() => {
      this.isEditorChanged = true;
    });

    this.isActivePreview = this.systemSettingsService.getIsActivePreview();
  }

  ngOnInit() {
    this._routeSubscription = this.route.params
      .switchMap(params => {
        return this.postService.articles$
          .map(posts => posts.find(post =>  post._id === params.id));
      })
      .map((article) => {
        if (!article) {
          this.router.navigate(['/dashboard/post']);
          return ;
        }
        this.article = article;

        this.form.setValue({
          info: this.article.info || '',
          content: this.article.content || '',
        });

        this.isEditorChanged = false;

        return article;
      })
      .auditTime(300)
      .map((article) => {
        if ( this.editorContent.codeMirror ) {
          this.editorContent.codeMirror.clearHistory();
        }

        return article;
      })
      .subscribe(() => {});

    this._configSubscription = this.configService.configJson$.subscribe((configJson) => {
      this.disablePostAsset = !configJson.post_asset_folder;
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
    this._formSubscription.unsubscribe();
    this._configSubscription.unsubscribe();
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
    this.isPublishing = true;
    this.postService.publish(this.article)
      .then(() => this.message.success('PUBLISH OK'))
      .catch(() => this.message.error('PUBLISH ERROR'))
      .finally( () => {
        this.isPublishing = false;
        this.message.remove(loadingMessageId);
      });
  }

  public remove() {
    this.modalService.confirm({
      nzTitle: 'REMOVE ARTICLE',
      nzContent: 'DO YOU WANT REMOVE ARTICLE:' + this.article.title,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.postService.delete(this.article).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => console.log('ERROR REMOVE ARTICLE', error))
    });
  }

  public save() {
    const loadingMessageId = this.message.loading('SAVING').messageId;
    if (!this.isNewPost) { this.isNewPost = true; }
    this.isSaving = true;
    this.article.info = this.form.value.info;
    this.article.content = this.form.value.content;

    this.postService.update(this.article)
      .then(() => {
        this.message.success('SAVING OK');
        this.isEditorChanged = false;
      })
      .catch(() => this.message.error('SAVING ERROR'))
      .finally( () => {
        this.isSaving = false;
        this.message.remove(loadingMessageId);
      });
  }

  public onPreviewClick() {
    this.systemSettingsService.saveIsActivePreview(this.isActivePreview);
  }

  public replaceSelection(type: string, text?: string) {
    const selectedText = text || this.editorContent.codeMirror.getSelection() || 'someValue';
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
        resultText = this._isURL(selectedText) ?
          `[](${selectedText})` :
          `[${selectedText}](https://)`;
        break;
      case 'image':
        resultText = `![](${selectedText})`; break;
      case 'imageLocal':
        resultText = this._isImageFormat(selectedText) ?
          `{% asset_img "${selectedText}" "some description"%}` :
          `{% asset_img "imagg.js" "${selectedText}"%}`;
        break;
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

    this.editorContent.codeMirror.replaceSelection(resultText, 'end');
    this.editorContent.codeMirror.focus();
  }

  public isMac () {
    return this.utilsService.isMac();
  }

  public onKeyDown($event): void {
    if (this.isMac()) {
      this.handleMacKeyEvents($event);
    } else {
      this.handleWindowsKeyEvents($event);
    }
  }

  handleMacKeyEvents($event) {
    const charCode = $event.key.toLowerCase();
    // matekey: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey
    if ($event.metaKey && charCode === 's') { this.save(); $event.preventDefault(); }
  }

  handleWindowsKeyEvents($event) {
    $event.preventDefault();
    const charCode = $event.key.toLowerCase();
    if ($event.ctrlKey && charCode === 's') { this.save(); $event.preventDefault(); }
  }

  public openAssetFolder() {
    const isOpened = this.postService.openAssetFolder(this.article.asset_dir);
    if (isOpened) {
      this.message.success('FOLDER IS OPENED');
    } else {
      this.message.error('OPEN FOLDER FAIL, MAY BE NOT EXIST');
    }
  }

  public onPaste($event) {
    if (this.utilsService.clipboardHasFormat('image')) {
      if (this.disablePostAsset ) {
        this.message.info('ENABLE post_asset_folder OF config.yml YOU CAN PASTE IMAGE');
        return;
      }
      this._openSaveArticleImageModal();
    }
  }

  private _openSaveArticleImageModal() {
    const clipboard = this.electronService.clipboard;
    const format = this.utilsService.clipboardHasFormat('jp') ? 'jpg' : 'png';
    let fileName = 'image-' + moment().unix();
    if (this.utilsService.clipboardHasFormat('plain')) {
      fileName = this.utilsService.removeFileExtension(clipboard.readText());
    }

    const saveArticleModal = this.modalService.create({
      nzTitle: 'SAVE IMAGE',
      nzContent: SaveArticleImageModalComponent,
      nzComponentParams: {
        image: clipboard.readImage(),
        fileName,
        format,
        article: this.article
      },
      nzFooter: null
    });

    saveArticleModal.afterClose.subscribe((file) => {
      if (file) {
        this.replaceSelection('imageLocal', file);
      }
    });
  }

  public isArray(object): boolean {
    return Array.isArray(object);
  }

  private _isURL(str): boolean {
    const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return pattern.test(str);
  }

  private _isImageFormat(str): boolean {
    return  (/\.(jpg|jpeg|png)$/i).test(str);
  }
}
