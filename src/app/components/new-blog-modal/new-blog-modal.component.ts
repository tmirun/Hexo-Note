import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ElectronService } from '../../services/electron.service';
import {UtilsService} from '../../services/utils.service';
import {HexoService} from '../../services/hexo.service';


@Component({
  selector: 'app-new-blog-modal',
  templateUrl: './new-blog-modal.component.html',
  styleUrls: ['./new-blog-modal.component.scss']
})
export class NewBlogModalComponent implements OnInit {

  public form: FormGroup;
  private isCreating = false;

  constructor(
    private fb: FormBuilder,
    private hexoService: HexoService,
    private electronService: ElectronService,
    private utils: UtilsService
  ) {
    this.form = this.fb.group({
      directory: [ this.electronService.app.getPath('documents') || '', [ Validators.required ]]
    });
  }

  ngOnInit() {
  }

  changePath() {
    const directory = this.utils.openDirectoryDialog();
    if (directory) {
      this.form.setValue({ directory });
    }
  }

  public submitForm(): void {
    for (const i in this.form.controls) {
      if (this.form.controls[i]) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }

    if (this.form.invalid) {
      return;
    }

    this.isCreating = true;

    this.hexoService.newBlog(this.form.value.directory);
  }
}
