import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as electron from 'electron';
import { ElectronService } from '../../services/electron.service';
import { UtilsService } from '../../services/utils.service';
import { Subscription } from 'rxjs';
import { AssetService } from '../../services/asset.service';
import { Article } from '../../Models/Article.interface';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-save-article-image-modal',
  templateUrl: './save-article-image-modal.component.html',
  styleUrls: ['./save-article-image-modal.component.scss']
})
export class SaveArticleImageModalComponent implements OnInit {

  @Input() image: typeof electron.NativeImage | any;
  @Input() fileName = '';
  @Input() format = 'png';
  @Input() article: Article = {};

  @ViewChild('imagePreview') imagePreview: ElementRef;

  public form: FormGroup;
  public imageSize: {width: number, height: number};
  public isSaving: boolean;

  private _formFileNameChangeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private assetService: AssetService,
    private electronService: ElectronService,
    private modalService: NzModalService,
    private utilsService: UtilsService,
    private message: NzMessageService,
    private modal: NzModalRef) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      fileName: [ this.fileName, [ Validators.required ] ],
      format: [ this.format, [ Validators.required ] ]
    });

    this._formFileNameChangeSubscription = this.form.valueChanges
      .debounceTime(300)
      .subscribe((values) => {
        const file = `${values.fileName}.${values.format}`;
        const isFileExist = this.assetService.checkIfExistFileName(this.article.asset_dir, file);
        if (isFileExist) {
          this.form.controls['fileName'].setErrors( {'exist': true});
        } else if (!this.form.controls['fileName'].errors) {
          this.form.controls['fileName'].setErrors( null);
        }
      });

    // set image data
    this.imageSize = this.image.getSize();
    this.imagePreview.nativeElement.style.height = this.imageSize.height + 'px';
    this.imagePreview.nativeElement.style.backgroundImage = `url(${this.image.toDataURL()})`;
  }

  public onSubmit() {
    this.isSaving = true;

    // validate form
    for (const i in this.form.controls) {
      if (this.form.controls[i]) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }

    if (this.form.invalid) {
      return;
    }

    let imageData = '';
    const fileName = this.form.value.fileName;
    const format = this.form.value.format;
    const file = `${fileName}.${format}`;

    switch (this.form.value.format) {
      case 'png':
        imageData = this.image.toPNG();
        break;
      case 'jpg':
        imageData = this.image.toJPEG();
        break;
    }

    this.assetService.saveImageToAssetDir(this.article.asset_dir, `${fileName}.${format}`, imageData)
      .then(() => {
        this.message.success('save asset ok');
        this.modal.triggerOk();
        this.modal.close(file);
      })
      .catch((err) => {
        this.message.error('save asset error: ' + err);
        this.modal.triggerCancel();
        this.modal.close(false);
      });
  }

}
