import { Component, KeyValueDiffers, NgZone, OnInit, forwardRef } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-editor',
  template: `
    <textarea
      [name]="name"
      class="ngx-codemirror {{ className }}"
      [class.ngx-codemirror--focused]="isFocused"
      autocomplete="off"
      [autofocus]="autoFocus"
      #ref>
    </textarea>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CustomEditorComponent),
    }
  ]

})
export class CustomEditorComponent extends CodemirrorComponent implements OnInit {

  constructor(
    _differs: KeyValueDiffers,
    _ngZone: NgZone
  ) {
    super(_differs, _ngZone);
  }

  ngOnInit() {
    console.log('THI', this.writeValue);
  }

}
