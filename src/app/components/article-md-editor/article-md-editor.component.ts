import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Subscription } from 'rxjs';
import { Article } from '../../Models/Article';
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
import { SystemSettingsService } from '../../services/system-settings.service';
import { NzModalService } from 'ng-zorro-antd';
import { ConfigService } from '../../services/config.service';
import { UtilsService } from '../../services/utils.service';
import { ElectronService } from '../../services/electron.service';
import { SaveArticleImageModalComponent } from '../save-article-image-modal/save-article-image-modal.component';
import { CustomMdEditorComponent } from '../custom-md-editor/custom-md-editor.component';

@Component({
  selector: 'app-article-md-editor',
  templateUrl: './article-md-editor.component.html',
  styleUrls: ['./article-md-editor.component.scss']
})
export class ArticleMdEditorComponent implements OnInit, OnDestroy, OnChanges {

  @Input() article: Article = {} as Article;
  @Output() articleChange = new EventEmitter<Article>();

  @Input() isChanged  = false;
  @Output() isChangedChange = new EventEmitter<boolean>();

  @ViewChild('editorContent') editorContent: CustomMdEditorComponent;
  @ViewChild('editorInfo') editorInfo: CustomMdEditorComponent;

  public form: FormGroup;
  public title: string;
  public isActivePreview = false;
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

  private _configSubscription: Subscription;

  constructor(
    private articleService: ArticleService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private electronService: ElectronService,
    private systemSettingsService: SystemSettingsService,
    private modalService: NzModalService,
    private configService: ConfigService,
    public utils: UtilsService
  ) {
    this.form = this.fb.group({
      info:  [ '', [ Validators.required ] ],
      content:  [ '', [ Validators.required ] ]
    });

    this.isActivePreview = this.systemSettingsService.getIsActivePreview();
  }

  ngOnInit() {
    this.form.setValue({
      info: this.article.info,
      content: this.article.content
    });

    // clean history when editor init;
    this._cleanHistory();

    this._configSubscription = this.configService.configJson$.subscribe((configJson) => {
      this.disablePostAsset = !configJson.post_asset_folder;
    });
  }

  ngOnDestroy() {
    this._configSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.article) {
      this.form.setValue({
        info: this.article.info,
        content: this.article.content
      });
      this._cleanHistory();
    }
  }

  public emitIsChanged () {
    this.isChangedChange.emit(true);
  }

  public publish() {
    const loadingMessageId = this.message.loading('PUBLISH').messageId;
    this.isPublishing = true;
    this.articleService.publish(this.article)
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
        this.articleService.delete(this.article).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => console.log('ERROR REMOVE ARTICLE', error))
    });
  }

  public save() {
    const loadingMessageId = this.message.loading('SAVING').messageId;
    this.isSaving = true;
    this.article.info = this.form.value.info;
    this.article.content = this.form.value.content;

    this.articleService.update(this.article)
      .then(() => {
        this.message.success('SAVING OK');
        this.isChangedChange.emit(false);
      })
      .catch(() => this.message.error('SAVING ERROR'))
      .finally( () => {
        this.isSaving = false;
        this.message.remove(loadingMessageId);
      });

    this.articleChange.emit(this.article);
  }

  public onKeyDown($event): void {
    const charCode = $event.key.toLowerCase();
    // matekey: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey
    const ctrlCmdKey = this.utils.isMac() ? $event.metaKey : $event.ctrlKey;

    if (ctrlCmdKey && charCode === 's') { this.save(); $event.preventDefault(); }

    this.emitIsChanged();
  }

  public onPreviewClick() {
    this.systemSettingsService.saveIsActivePreview(this.isActivePreview);
  }

  public openAssetFolder() {
    const isOpened = this.articleService.openAssetFolder(this.article.asset_dir);
    if (isOpened) {
      this.message.success('FOLDER IS OPENED');
    } else {
      this.message.error('OPEN FOLDER FAIL, MAY BE NOT EXIST');
    }
  }

  public onPaste($event) {
    if (this.utils.clipboardHasFormat('image')) {
      if (this.disablePostAsset ) {
        this.message.info('ENABLE post_asset_folder OF config.yml YOU CAN PASTE IMAGE');
        return;
      }
      this._openSaveArticleImageModal();
    }
  }

  private _openSaveArticleImageModal() {
    const clipboard = this.electronService.clipboard;
    const format = this.utils.clipboardHasFormat('jp') ? 'jpg' : 'png';
    let fileName = 'image-' + moment().unix();
    if (this.utils.clipboardHasFormat('plain')) {
      fileName = this.utils.removeFileExtension(clipboard.readText());
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
        this.editorContent.imageLocal(file);
      }
    });
  }

  private _cleanHistory() {
    if (this.editorInfo.codeMirror) {
      this.editorInfo.codeMirror.clearHistory();
    } else {
      setTimeout(() => {
        return this.editorInfo.codeMirror ? this.editorInfo.codeMirror.clearHistory() : '';
      }, 1000);
    }

    if (this.editorContent.codeMirror) {
      this.editorContent.codeMirror.clearHistory();
    } else {
      setTimeout(() => {
        return this.editorContent.codeMirror ? this.editorContent.codeMirror.clearHistory() : '';
      }, 1000);
    }
  }

  public isArray(object): boolean {
    return Array.isArray(object);
  }

  public ctrlOrCmd(): string {
    return this.utils.isMac() ? 'Cmd' : 'Ctrl';
  }
}
