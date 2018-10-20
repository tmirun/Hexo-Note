import { Component, KeyValueDiffers, NgZone, OnInit, forwardRef } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-custom-md-editor',
  templateUrl: './custom-md-editor.component.html',
  styleUrls: ['./custom-md-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CustomMdEditorComponent),
    }
  ]

})
export class CustomMdEditorComponent extends CodemirrorComponent implements OnInit {

  public codeMirror: any;

  constructor(
    _differs: KeyValueDiffers,
    _ngZone: NgZone,
    private utils: UtilsService,
  ) {
    super(_differs, _ngZone);
  }

  ngOnInit() {
  }

  public onKeyDown($event: KeyboardEvent): void {
    const charCode = $event.key.toLowerCase();
    const ctrlCmdKey = this.utils.isMac() ? $event.metaKey : $event.ctrlKey;
    const alt = $event.altKey;
    const shift = $event.shiftKey;

    if (ctrlCmdKey && shift && charCode === 'i') { this.image(); $event.preventDefault(); return; }
    if (ctrlCmdKey && shift && charCode === 'c') { this.codeBlock(); $event.preventDefault(); return; }

    if (ctrlCmdKey && charCode === 's') { $event.preventDefault(); }
    if (ctrlCmdKey && charCode === '1') { this.header(1); $event.preventDefault(); return; }
    if (ctrlCmdKey && charCode === '2') { this.header(2); $event.preventDefault(); return; }
    if (ctrlCmdKey && charCode === '3') { this.header(3); $event.preventDefault(); return; }
    if (ctrlCmdKey && charCode === '4') { this.header(4); $event.preventDefault(); return; }
    if (ctrlCmdKey && charCode === '5') { this.header(5); $event.preventDefault(); return; }
    if (ctrlCmdKey && charCode === '6') { this.header(6); $event.preventDefault(); return; }
    if (ctrlCmdKey && charCode === 'b') { this.bold(); $event.preventDefault(); return; }
    if (ctrlCmdKey && charCode === 'i') { this.italic(); $event.preventDefault(); return; }
    if (ctrlCmdKey && charCode === 'l') { this.listUl(); $event.preventDefault(); return; }
    if (ctrlCmdKey && charCode === 'k') { this.link(); $event.preventDefault(); return; }
  }


  // All below method you can consulting in https://github.com/pandao/editor.md/blob/master/src/editormd.js

  public undo() { this.codeMirror.undo(); }

  public redo() { this.codeMirror.redo(); }

  public header (headerNumber = 1) {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();
    const prefix = '#'.repeat(headerNumber);

    if (cursor.ch !== 0) {
      cm.setCursor(cursor.line, 0);
      cm.replaceSelection(`${prefix} ${selection}` );
      cm.setCursor(cursor.line, cursor.ch + 4);
    } else {
      cm.replaceSelection(`${prefix} ${selection}` );
    }
  }

  public bold() {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();

    cm.replaceSelection('**' + selection + '**');

    if (selection === '') {
      cm.setCursor(cursor.line, cursor.ch + 2);
    }
  }

  public del() {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();

    cm.replaceSelection('~~' + selection + '~~');

    if (selection === '') {
      cm.setCursor(cursor.line, cursor.ch + 2);
    }
  }

  public italic () {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();

    cm.replaceSelection('*' + selection + '*');

    if (selection === '') {
      cm.setCursor(cursor.line, cursor.ch + 1);
    }
  }

  public quote () {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();

    if (cursor.ch !== 0) {
      cm.setCursor(cursor.line, 0);
      cm.replaceSelection('> ' + selection);
      cm.setCursor(cursor.line, cursor.ch + 2);
    } else {
      cm.replaceSelection('> ' + selection);
    }

    cm.replaceSelection('> ' + selection);
    cm.setCursor(cursor.line, (selection === '') ? cursor.ch + 2 : cursor.ch + selection.length + 2);
  }

  public listUl () {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();

    if (selection === '') {
      cm.replaceSelection('- ' + selection);
    } else {
      const selectionText = selection.split('\n');

      for (let i = 0, len = selectionText.length; i < len; i++) {
        selectionText[i] = (selectionText[i] === '') ? '' : '- ' + selectionText[i];
      }

      cm.replaceSelection(selectionText.join('\n'));
    }
  }

  public listOl () {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();

    if (selection === '') {
      cm.replaceSelection('1. ' + selection);
    } else {
      const selectionText = selection.split('\n');

      for (let i = 0, len = selectionText.length; i < len; i++) {
        selectionText[i] = (selectionText[i] === '') ? '' : (i + 1) + '. ' + selectionText[i];
      }

      cm.replaceSelection(selectionText.join('\n'));
    }
  }

  hr () {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();

    cm.replaceSelection(((cursor.ch !== 0) ? '\n\n' : '\n') + '------------\n\n');
  }


  public link () {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();

    cm.replaceSelection(`[](${selection})`);

    if (selection === '') {
      cm.setCursor(cursor.line, cursor.ch + 3);
    }
  }

  public image () {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();

    cm.replaceSelection(`![](${selection})`);

    if (selection === '') {
      cm.setCursor(cursor.line, cursor.ch + 4);
    }
  }

  public code () {
    const cm        = this.codeMirror;
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();

    cm.replaceSelection('`' + selection + '`');

    if (selection === '') {
      cm.setCursor(cursor.line, cursor.ch + 1);
    }
  }

  public codeBlock () {
    const cm        = this.codeMirror
    const cursor    = cm.getCursor();
    const selection = cm.getSelection();

    cm.replaceSelection('```\n' + selection + '\n```');

    if (selection === '') {
      cm.setCursor(cursor.line + 1, 0);
    }
  }


}
