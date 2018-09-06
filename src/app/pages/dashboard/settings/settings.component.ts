import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { SystemSettingsService } from '../../../services/system-settings.service';
import { ConfigService } from '../../../services/config.service';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public hexoPath = '';
  public configYmlForm: FormGroup;

  private configYmlSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private systemSettingsService: SystemSettingsService,
    private configService: ConfigService,
    private message: NzMessageService,
    private utilsService: UtilsService
  ) {

    this.hexoPath = this.systemSettingsService.getHexoPath();
    this.configService.getConfigYml();

    this.configYmlForm = this.fb.group({
      configYml: ''
    });
  }

  ngOnInit() {
    this.configYmlSubscription = this.configService.configYml$.subscribe((configYml) => {
      this.configYmlForm.setValue({
        configYml
      });
    });
  }

  ngOnDestroy() {
    this.configYmlSubscription.unsubscribe();
  }

  public showSelectHexoPath() {
    const path = this.systemSettingsService.showSelectHexoPath();
    if (!path) { return; }
    if (this.systemSettingsService.isHexoProjectPath(path)) {
      this.hexoPath = path;
      location.reload();
    } else {
      this.systemSettingsService.showNotHexoProjectPathAlert();
      this.showSelectHexoPath();
    }
  }

  public save() {
    const loadingMessageId = this.message.loading('SAVING').messageId;

    this.configService.updateConfigYml(this.configYmlForm.value.configYml)
      .then(() => this.message.success('SAVING OK'))
      .catch(() => this.message.error('SAVING ERROR'))
      .finally( () => this.message.remove(loadingMessageId));
  }


  public onKeyDown($event): void {
    if (this.utilsService.isMac()) {
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
}
